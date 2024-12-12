import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { db, showToast } from "./index.js";
import { getImgUrl } from "./imageService.js";

export const addProduct = async (formData) => {
    try {
        const docRef = await addDoc(collection(db, "products"), {
            ...formData.productData,
            rating: 0,
            creationTime: Timestamp.fromDate(new Date()),
            varyants: []
        });

        if (docRef.id) {
            const updatedVariants = await Promise.all(
                formData.varyants.map(async (varyant) => {
                    const updatedImgs = await Promise.all(
                        varyant.imgs.map(async (img) => {
                            if (img !== null) {
                                try {
                                    return await getImgUrl(docRef.id, img.file, "productImages");
                                } catch (error) {
                                    console.error("Resim yükleme hatası: ", error);
                                    return null;
                                }
                            }
                            return null;
                        })
                    );
                    return {
                        ...varyant,
                        imgs: updatedImgs,
                    };
                })
            );

            const updateDocRef = doc(db, "products", docRef.id);
            await updateDoc(updateDocRef, { varyants: updatedVariants });

            showToast('success', `"${formData.productData.productName}" isimli ürün başarıyla eklendi.`);
            return true;
        }
    } catch (error) {
        console.error("Error adding document: ", error);
        showToast('error', "Ürün eklenirken bir hata oluştu.");
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
