import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db, showToast } from "./index.js";

export const addFabric = async (fabricName) => {
    try {
        const docRef = await addDoc(collection(db, "fabrics"), {
            name: fabricName,
            creationTime: Timestamp.fromDate(new Date())
        });

        showToast('success', `"${fabricName}" isimli kumaş başarıyla eklendi.`);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error adding document: ", error);
        showToast('error', "Kumaş eklenirken bir hata oluştu.");
    }
};

export const deleteFabricByFabricId = async (data) => {
    let isSuccess = false;

    await deleteDoc(doc(db, "fabrics", data.id)).then(() => {
        showToast('warning', `"${data.fabricName}" isimli kumaş başarıyla silindi.`);
        isSuccess = true;
    });

    return isSuccess;
};

export const getAllFabrics = async () => {
    const first = query(collection(db, "fabrics"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first);
    return querySnapshot;
};

export const getFabricsByFabricId = async (fabricId) => {
    const docRef = doc(db, "fabrics", fabricId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
};
