
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, runTransaction, updateDoc } from "firebase/firestore";
import { db, showToast } from "./index.js";



const getUserOrderRef = (userId, orderId) => doc(db, `users/${userId}/orders/${orderId}`);
const getCentralOrderRef = (orderId) => doc(db, `orders/${orderId}`);


export const getAllOrders = async () => {
    try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, orders };
    } catch (error) {
        showToast('error', 'Siparişler alınırken bir hata oluştu');
        console.error("getAllOrders Error:", error);
        return { success: false, orders: [] };
    }
};


export const createOrder = async (userId, orderData) => {
    const orderId = doc(collection(db, "orders")).id;
    const newOrder = {
        ...orderData,
        userId,
        id: orderId,
        status: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    try {
        await runTransaction(db, async (transaction) => {
            transaction.set(getUserOrderRef(userId, orderId), newOrder);
            transaction.set(getCentralOrderRef(orderId), newOrder);
        });

        showToast('success', 'Sipariş başarıyla oluşturuldu');
        return { success: true, orderId, order: newOrder };
    } catch (error) {
        showToast('error', 'Sipariş eklenirken bir hata oluştu');
        console.error('Create Order Error:', error);
        throw error;
    }
};



export const readOrder = async (userId, orderId) => {
    try {
        const orderSnap = await getDoc(getUserOrderRef(userId, orderId));

        if (orderSnap.exists()) {
            // showToast('success', 'Sipariş başarıyla getirildi');
            return { success: true, order: orderSnap.data() };
        } else {
            showToast('error', 'Sipariş bulunamadı');
            return { success: false, order: null };
        }
    } catch (error) {
        showToast('error', 'Sipariş getirilirken bir hata oluştu');
        console.error('Read Order Error:', error);
        throw error;
    }
};

export const readOrdersByUserId = async (userId) => {
    try {
        const ordersRef = collection(db, `users/${userId}/orders`);
        const querySnapshot = await getDocs(ordersRef);

        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        if (orders.length > 0) {
            return { success: true, orders };
        } else {
            showToast('error', 'Sipariş bulunamadı');
            return { success: false, orders: [] };
        }
    } catch (error) {
        showToast('error', 'Siparişler getirilirken bir hata oluştu');
        console.error('Read Orders Error:', error);
        throw error;
    }
};



export const updateOrder = async (userId, orderId, updatedData) => {
    try {
        await updateDoc(getUserOrderRef(userId, orderId), {
            ...updatedData,
            updatedAt: new Date().toISOString()
        });

        showToast('success', 'Sipariş başarıyla güncellendi');
        return { success: true };
    } catch (error) {
        showToast('error', 'Sipariş güncellenirken bir hata oluştu');
        console.error('Update Order Error:', error);
        throw error;
    }
};


export const deleteOrder = async (userId, orderId) => {
    try {
        await deleteDoc(getUserOrderRef(userId, orderId));
        showToast('success', 'Sipariş başarıyla silindi');
        return { success: true };
    } catch (error) {
        showToast('error', 'Sipariş silinirken bir hata oluştu');
        console.error('Delete Order Error:', error);
        throw error;
    }
};

