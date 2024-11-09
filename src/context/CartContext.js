import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { addToCartFb, clearCartFb, getCart, removeCartItem } from '../firebase';
import { useSelector } from 'react-redux';

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

        case actionTypes.ADD_TO_CART:
            const { product, quantity } = action.payload;
            const existingProductIndex = state.items.findIndex(item => item.id === product.id);
            const updatedItems = [...state.items];

            if (existingProductIndex >= 0) {
                updatedItems[existingProductIndex].quantity += quantity;
            } else {
                updatedItems.push({ ...product, quantity });
            }

            return {
                ...state,
                items: updatedItems,
                totalQuantity: state.totalQuantity + quantity,
                totalAmount: state.totalAmount + product.price * quantity,
            };

        case actionTypes.REMOVE_FROM_CART:
            const productId = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === productId);
            const itemToRemove = state.items[itemIndex];

            return {
                ...state,
                items: state.items.filter(item => item.id !== productId),
                totalQuantity: state.totalQuantity - itemToRemove.quantity,
                totalAmount: state.totalAmount - itemToRemove.price * itemToRemove.quantity,
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
        const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
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
    const addToCart = async (productId, product, quantity = 1) => {


        try {
            // Firestore'a güncelleme veya ekleme
            addToCartFb(user.uid, productId, product, quantity)

            dispatch({ type: actionTypes.ADD_TO_CART, payload: { product, quantity } });
        } catch (error) {
            console.error("Add to Cart Error:", error);
        }
    };

    // Sepetten Ürün Kaldırma (Firebase ve State)
    const removeFromCart = async (productId) => {

        try {
            removeCartItem(user.uid, productId)
            dispatch({ type: actionTypes.REMOVE_FROM_CART, payload: productId });
        } catch (error) {
            console.error("Remove from Cart Error:", error);
        }
    };

    // Sepeti Temizleme (Firebase ve State)
    const clearCart = async () => {

        try {
            clearCartFb(user.uid).then(res => {
                dispatch({ type: actionTypes.CLEAR_CART });
            })
        } catch (error) {
            console.error("Clear Cart Error:", error);
        }
    };

    return (
        <CartContext.Provider value={{ ...state, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook
export const useCart = () => {
    return useContext(CartContext);
};
