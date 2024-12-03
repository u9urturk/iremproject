import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { db, showToast } from "./index.js";
import { uploadImage } from "./imageService.js";

export const addProduct = async (formData) => {
    try {
        const docRef = await addDoc(collection(db, "products"), {
            ...formData.productData,
            rating: 0,
            creationTime: Timestamp.fromDate(new Date()),
            photos: [] // Başlangıçta boş bırakıyoruz.
        });

        if (docRef.id) {
            // Fotoğrafların yükleme işlemlerini başlatıyoruz
            const uploadPromises = formData.photos.map(photo => {
                if (photo !== null) {
                    return uploadImage("productImages", docRef.id, photo.file);
                }
            });

            // Fotoğraflar yüklendikten sonra Firestore'u güncelliyoruz
            await Promise.all(uploadPromises);
            
            // Firestore belgesine fotoğrafları ekliyoruz
            await updateProductPhotos(docRef.id, formData.photos);

            showToast('success', `"${formData.productData.productName}" isimli ürün başarıyla eklendi.`);
        }
    } catch (error) {
        console.error("Error adding document: ", error);
        showToast('error', "Ürün eklenirken bir hata oluştu.");
    }
};


const updateProductPhotos = async (productId, photos) => {
    try {
        const photoUrls = photos.map(photo => photo.url); 
        const docRef = doc(db, "products", productId);
        await updateDoc(docRef, { photos: photoUrls });
    } catch (error) {
        console.error("Fotoğraflar güncellenirken hata oluştu:", error);
        showToast('error', "Fotoğraflar güncellenirken bir hata oluştu.");
    }
};



export const deleteProductByProductId = async (data) => {
    try {
        await deleteDoc(doc(db, "products", data.productId));
        showToast('warning', `"${data.productName}" isimli ürün başarıyla silindi.`);
        return true;
    } catch (error) {
        console.error("Ürün silinirken hata oluştu:", error);
        showToast('error', "Ürün silinirken bir hata oluştu.");
        return false;
    }
};


export const getProducts = async () => {
    try {
        const q = query(collection(db, "products"), orderBy("creationTime", "desc"));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, products };
    } catch (error) {
        console.error("Ürünler alınırken hata oluştu:", error);
        showToast('error', "Ürünler alınırken bir hata oluştu.");
        return { success: false, products: [] };
    }
};



export const getProductByCategoryId = async (categoryId) => {
    try {
        const q = query(collection(db, "products"), where("categoryId", "==", categoryId));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, products };
    } catch (error) {
        console.error("Kategoriye göre ürünler alınırken hata oluştu:", error);
        showToast('error', "Kategoriye göre ürünler alınırken bir hata oluştu.");
        return { success: false, products: [] };
    }
};


export const getProductByProductId = async (productId) => {
    try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, product: docSnap.data() };
        } else {
            showToast('error', "Ürün bulunamadı.");
            return { success: false, product: null };
        }
    } catch (error) {
        console.error("Ürün getirilirken hata oluştu:", error);
        showToast('error', "Ürün getirilirken bir hata oluştu.");
        return { success: false, product: null };
    }
};
