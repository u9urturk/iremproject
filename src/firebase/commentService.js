import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, showToast } from "./index.js";

async function addComment(data) {
    try {
        const docRef = await addDoc(collection(db, "comments"), data);
        showToast('success', 'Yorum başarıyla eklendi!');
        
        return {
            id: docRef.id,
            customerName: data.customerName,
            comment: data.comment,
            date: new Date(data.date).toLocaleDateString('tr-TR'),
            rating: data.rating
        };
    } catch (e) {
        showToast('error', 'Yorum eklenirken hata oluştu!');
        console.error("Yorum eklenirken hata oluştu: ", e);
    }
}

async function getCommentsByProductId(productId) {
    const q = query(collection(db, "comments"), where("productId", "==", productId));

    try {
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return comments;
    } catch (e) {
        console.error("Yorumlar getirilirken hata oluştu: ", e);
        return [];
    }
}

export {
    addComment,
    getCommentsByProductId
};
