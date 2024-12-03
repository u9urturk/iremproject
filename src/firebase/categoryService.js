import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db, showToast } from "./index.js";

export const getCategories = async () => {
    const first = query(collection(db, "categories"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first);
    return querySnapshot;
};

export const getCategoryByCategoryId = async (categoryId) => {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
};

export const addCategory = async (categoryName) => {
    try {
        const docRef = await addDoc(collection(db, "categories"), {
            name: categoryName,
            creationTime: Timestamp.fromDate(new Date())
        });

        showToast('success', `"${categoryName}" isimli kumaş başarıyla eklendi.`);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error adding document: ", error);
        showToast('error', "Renk eklenirken bir hata oluştu.");
    }
};

export const deleteCategoryByCategoryId = async (data) => {
    let isSuccess = false;

    await deleteDoc(doc(db, "categories", data.id)).then(() => {
        showToast('warning', `"${data.categoryName}" isimli kategori başarıyla silindi.`);
        isSuccess = true;
    });

    return isSuccess;
};

export const updateCategoryByCategoryId = async (categoryId, categoryName) => {
    let isSuccess = false;

    const washingtonRef = doc(db, "categories", categoryId);

    await updateDoc(washingtonRef, {
        categoryName: categoryName
    }).then(() => {
        showToast('warning', `Mevcut kategori "${categoryName}" ismiyle güncellendi.`);
        isSuccess = true;
    });

    return isSuccess;
};
