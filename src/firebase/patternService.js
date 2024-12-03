import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db, showToast } from "./index.js";
import { getImgUrls } from "./imageService.js";

export const updatePattern = async (docId, updateFields, baseData = {}) => {
    try {
        const docRef = doc(db, "patterns", docId);

        await updateDoc(docRef, {
            ...baseData,
            imgsUrl: updateFields,
            updateTime: Timestamp.fromDate(new Date())
        });

        console.log("Belge başarıyla güncellendi.");
    } catch (error) {
        console.error("Güncelleme sırasında bir hata oluştu:", error);
        showToast('error', "Desen güncellenirken bir hata oluştu.");
    }
};

export const addPattern = async ({ patternName, files }) => {
    try {
        const baseData = {
            name: patternName,
            creationTime: Timestamp.fromDate(new Date())
        };

        const docRef = await addDoc(collection(db, "patterns"), baseData);
        const imgUrls = await getImgUrls(docRef.id, files);

        await updatePattern(docRef.id, imgUrls, baseData);

        showToast('success', `"${patternName}" isimli kumaş başarıyla eklendi.`);
        return docRef.id;

    } catch (error) {
        console.error("Desen eklenirken hata oluştu:", error);
        showToast('error', "Desen eklenirken bir hata oluştu.");
    }
};


export const deletePatternByPatternId = async (data) => {
    try {
        await deleteDoc(doc(db, "patterns", data.id));
        showToast('warning', `"${data.patternName}" isimli desen başarıyla silindi.`);
        return true;
    } catch (error) {
        console.error("Desen silinirken hata oluştu:", error);
        showToast('error', "Desen silinirken bir hata oluştu.");
        return false;
    }
};


export const getPatterns = async () => {
    try {
        const q = query(collection(db, "patterns"), orderBy("creationTime", "asc"));
        const querySnapshot = await getDocs(q);

        const patterns = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, patterns };
    } catch (error) {
        console.error("Desenler alınırken hata oluştu:", error);
        showToast('error', "Desenler alınırken bir hata oluştu.");
        return { success: false, patterns: [] };
    }
};


export const getPatternByPatternId = async (patternId) => {
    try {
        const docRef = doc(db, "patterns", patternId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, pattern: docSnap.data() };
        } else {
            showToast('error', "Desen bulunamadı.");
            return { success: false, pattern: null };
        }
    } catch (error) {
        console.error("Desen getirilemedi:", error);
        showToast('error', "Desen getirilirken bir hata oluştu.");
        return { success: false, pattern: null };
    }
};

