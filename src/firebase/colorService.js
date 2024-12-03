import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db, showToast } from "./index.js";

export const addColor = async (values) => {
    try {
        const docRef = await addDoc(collection(db, "colors"), {
            name: values.colorName,
            colorCode: values.colorCode,
            creationTime: Timestamp.fromDate(new Date())
        });

        showToast('success', `"${values.colorName}" isimli renk başarıyla eklendi.`);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error adding document: ", error);
        showToast('error', "Renk eklenirken bir hata oluştu.");
    }
};

export const deleteColorByColorId = async (data) => {
    let isSuccess = false;

    await deleteDoc(doc(db, "colors", data.colorId)).then(() => {
        showToast('warning', `"${data.name}" isimli renk başarıyla silindi.`);
        isSuccess = true;
    });

    return isSuccess;
};

export const getColors = async () => {
    const first = query(collection(db, "colors"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first);
    return querySnapshot;
};

export const getColorByColorId = async (colorId) => {
    const docRef = doc(db, "colors", colorId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
};
