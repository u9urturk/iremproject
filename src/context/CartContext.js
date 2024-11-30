import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { addToCartFb, clearCartFb, getCart, removeCartItem, updateCartItem } from '../firebase';
import { useSelector } from 'react-redux';
import Product from '../pages/Product';

// Sepet durumu için başlangıç durumu 
const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

// Aksiyon türleri
const actionTypes = {
    SET_CART: "SET_CART",
    ADD_TO_CART: "ADD_TO_CART",
    REMOVE_FROM_CART: "REMOVE_FROM_CART",
    CLEAR_CART: "CLEAR_CART",
    UPDATE_FROM_CART: "UPDATE_CART"
};

// Sepet durumunu yönetmek için reducer fonksiyonu
const cartReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_CART:
            return {
                ...state,
                items: action.payload.items,
                totalQuantity: action.payload.totalQuantity,
                totalAmount: action.payload.totalAmount,
            };

        case actionTypes.UPDATE_FROM_CART:
            const { uProductId, uType } = action.payload
            const uExistingProductIndex = state.items.findIndex(item => item.id === uProductId);
            const uUpdatedItems = [...state.items];


            if (uType === "REDUCE") {
                uUpdatedItems[uExistingProductIndex].quantity -= 1;
                return {
                    ...state,
                    items: uUpdatedItems,
                    totalQuantity: state.totalQuantity - 1,
                    totalAmount: state.totalAmount - (uUpdatedItems[uExistingProductIndex].isFullPrice?
                        uUpdatedItems[uExistingProductIndex].fullPrice
                        :uUpdatedItems[uExistingProductIndex].basePrice )* 1
                };
            } else {
                uUpdatedItems[uExistingProductIndex].quantity += 1;
                return {
                    ...state,
                    items: uUpdatedItems,
                    totalQuantity: state.totalQuantity + 1,
                    totalAmount: state.totalAmount + (uUpdatedItems[uExistingProductIndex].isFullPrice?
                        uUpdatedItems[uExistingProductIndex].fullPrice
                        :uUpdatedItems[uExistingProductIndex].basePrice )* 1
                };

            }



        case actionTypes.ADD_TO_CART:
            const { updatedProduct, quantity, baseImage, id} = action.payload;
            const existingProductIndex = state.items.findIndex(item => item.id === id);
            const updatedItems = [...state.items];

            if (existingProductIndex >= 0) {
                updatedItems[existingProductIndex].quantity += quantity;
            } else {
                updatedItems.push({ ...updatedProduct, quantity, baseImage, id });
            }

            console.log(updatedProduct)

            return {
                ...state,
                items: updatedItems,
                totalQuantity: state.totalQuantity + quantity,
                totalAmount: state.totalAmount + (updatedProduct.isFullPrice?updatedProduct.fullPrice:updatedProduct.basePrice) * quantity,
            };

        case actionTypes.REMOVE_FROM_CART:
            const productId = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === productId);
            const itemToRemove = state.items[itemIndex];

            return {
                ...state,
                items: state.items.filter(item => item.id !== productId),
                totalQuantity: state.totalQuantity - itemToRemove.quantity,
                totalAmount: state.totalAmount - (itemToRemove.isFullPrice?itemToRemove.fullPrice:itemToRemove.basePrice) * itemToRemove.quantity,
            };

        case actionTypes.CLEAR_CART:
            return initialState;

        default:
            return state;
    }
};

// CartContext ve Provider
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const user = useSelector(state => state.auth.user)


    // Firestore ile senkronize etmek için sepeti ayarla
    const setCart = (cartItems) => {
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = cartItems.reduce((total, item) => total + (item.isFullPrice?item.fullPrice:item.basePrice) * item.quantity, 0);
        dispatch({ type: actionTypes.SET_CART, payload: { items: cartItems, totalQuantity, totalAmount } });
    };

    // Firestore'dan sepeti getir ve durumu ayarla
    const fetchCartFromFirestore = async () => {
        try {
            const cartItems = (await getCart(user.uid)).cartItems
            setCart(cartItems);
        } catch (error) {
            console.error("Fetch Cart Error:", error);
        }
    };

    useEffect(() => {
        if (user?.uid) {
            fetchCartFromFirestore();
        } else {
            dispatch({ type: actionTypes.CLEAR_CART });
        }
    }, [user?.uid]);

    // Sepete Ürün Ekleme (Firebase ve State)
    const addToCart = async (id, product, quantity = 1, baseImage,isFullPrice) => {
        const updatedProduct  = {...product,isFullPrice}
 
        try {
            // Firestore'a güncelleme veya ekleme
            addToCartFb(user.uid, id, updatedProduct, quantity, baseImage).then(() => {
                dispatch({ type: actionTypes.ADD_TO_CART, payload: {updatedProduct, quantity, baseImage, id } });

            })
        } catch (error) {
            console.error("Add to Cart Error:", error);
        }
    };

    const updateQantityFromCart = async (productId, quantity, type) => {
        switch (type) {
            case "REDUCE":
                const reduceQauntity = quantity - 1;
                updateCartItem(user.uid, productId, reduceQauntity).then(() => {
                    dispatch({ type: actionTypes.UPDATE_FROM_CART, payload: { uProductId: productId, uType: type } });

                })
                break;
            case "INCREASE":
                const increaseQauntity = quantity + 1;
                updateCartItem(user.uid, productId, increaseQauntity).then(() => {
                    dispatch({ type: actionTypes.UPDATE_FROM_CART, payload: { uProductId: productId, uType: type } });
                })

                break;

            default:
                break;
        }

    }

    // Sepetten Ürün Kaldırma (Firebase ve State)
    const removeFromCart = async (productId) => {

        try {
            removeCartItem(user.uid, productId).then(() => {
                dispatch({ type: actionTypes.REMOVE_FROM_CART, payload: productId });
            })
        } catch (error) {
            console.error("Remove from Cart Error:", error);
        }
    };

    // Sepeti Temizleme (Firebase ve State)
    const clearCart = async (info=true) => {

        try {
            clearCartFb(user.uid,info).then(() => {
                dispatch({ type: actionTypes.CLEAR_CART });
            })
        } catch (error) {
            console.error("Clear Cart Error:", error);
        }
    };

    return (
        <CartContext.Provider value={{ ...state, addToCart, removeFromCart, clearCart, updateQantityFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook
export const useCart = () => {
    return useContext(CartContext);
};
