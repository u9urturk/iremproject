import { collection, deleteDoc, doc, getDoc, getDocs, increment, setDoc, updateDoc } from "firebase/firestore";
import { db, showToast } from "./index.js";

export const addToCartFb = async (userId, productId, productData, quantity = 1, baseImage) => {
    try {
        const cartRef = doc(db, "users", userId, "cart", productId);
        // Ürünün mevcut olup olmadığını kontrol et
        const existingProductSnap = await getDoc(cartRef);

        if (existingProductSnap && existingProductSnap.exists()) {
            // Ürün zaten varsa miktarını artır
            await updateDoc(cartRef, {
                quantity: increment(quantity),
                updatedAt: new Date().toISOString()
            })
        } else {
            // Ürün yoksa yeni bir ürün olarak ekle
            const newCartItem = {
                ...productData,
                quantity: quantity,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                baseImage: baseImage
            };
            await setDoc(cartRef, newCartItem);
        }
        showToast('success', 'Ürün sepete başarıyla eklendi');
        return { success: true, documentId: cartRef.id };
    } catch (error) {
        showToast('error', 'Ürün sepete eklenirken bir hata oluştu');
        console.error('Add to Cart Error:', error);
    }
};

// Sepeti Getirme
export const getCart = async (userId) => {
    try {
        const cartRef = collection(db, "users", userId, "cart");
        const cartSnap = await getDocs(cartRef);

        const cartItems = cartSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, cartItems };
    } catch (error) {
        showToast('error', 'Sepet getirilirken bir hata oluştu');
        console.error('Get Cart Error:', error);
    }
};

// Sepetteki Ürünü Güncelleme
export const updateCartItem = async (userId, productId, quantity) => {
    try {
        const cartRef = doc(db, "users", userId, "cart", productId);

        if (quantity > 0) {
            // Miktar güncelle
            await updateDoc(cartRef, {
                quantity: quantity,
                updatedAt: new Date().toISOString()
            });
            showToast('success', 'Sepet öğesi başarıyla güncellendi');
        } else {
            // Miktar sıfır veya daha az ise ürünü sepetten çıkar
            await deleteDoc(cartRef);
            showToast('success', 'Ürün sepetten çıkarıldı');
        }
        return { success: true };
    } catch (error) {
        showToast('error', 'Sepet güncellenirken bir hata oluştu');
        console.error('Update Cart Item Error:', error);
    }
};

// Sepetten Ürün Silme
export const removeCartItem = async (userId, productId, info = true) => {
    try {
        const cartRef = doc(db, "users", userId, "cart", productId);

        await deleteDoc(cartRef);
        info && showToast('success', 'Ürün sepetten başarıyla çıkarıldı');
        return { success: true };
    } catch (error) {
        showToast('error', 'Ürün sepetten çıkarılırken bir hata oluştu');
        console.error('Remove Cart Item Error:', error);
    }
};

// Sepeti Temizleme
export const clearCartFb = async (userId, info) => {
    try {
        const cartRef = collection(db, "users", userId, "cart");
        const cartSnap = await getDocs(cartRef);
        // const batch = db.batch();
        cartSnap.docs.forEach((doc) => removeCartItem(userId, doc.id, false));
        // await batch.commit();

        info && showToast('success', 'Sepet başarıyla temizlendi');
        return { success: true };
    } catch (error) {
        showToast('error', 'Sepet temizlenirken bir hata oluştu');
        console.error('Clear Cart Error:', error);
    }
};



