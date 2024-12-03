import { getDownloadURL, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { showToast, storage } from "./index.js";

export const getImgUrl = async (id, file) => {
    try {
        const imgUrl = await uploadImage("patterns", id, file);
        return imgUrl;
    } catch (error) {
        throw error;
    }
};

export const getImgUrls = async (id, files) => {
    try {
        const uploadPromises = files.map(file =>file!==null? uploadImage("patterns", id, file.file):null);
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw error;
    }
};



export const uploadImage = async (target, id, file) => {
    if (!file) throw new Error("File cannot be null.");

    const storageRef = ref(storage, `${target}/${id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                showToast('info', `Yükleniyor... %${Math.round(progress)}`);
            },
            error => {
                showToast('error', "Yükleme sırasında bir hata oluştu.");
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    showToast('success', "Başarıyla Yüklendi!");
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

export const uploadImageBilboard = (file) => uploadImage("bilboard", "", file);


export const downloadImage = async (target, productId) => {
    try {
        const listRef = ref(storage, `${target}/${productId}`);
        const res = await listAll(listRef);
        const url = await getDownloadURL(res.items[0]);
        return url;
    } catch (error) {
        handleStorageError(error);
        return null;
    }
};

export const downloadImages = async (target, productId) => {
    try {
        const listRef = ref(storage, `${target}/${productId}`);
        const res = await listAll(listRef);
        return await Promise.all(res.items.map(item => getDownloadURL(item)));
    } catch (error) {
        handleStorageError(error);
        return [];
    }
};

const handleStorageError = (error) => {
    switch (error.code) {
        case 'storage/object-not-found':
            showToast('error', "Dosya bulunamadı.");
            break;
        case 'storage/unauthorized':
            showToast('error', "Yetkisiz erişim.");
            break;
        case 'storage/canceled':
            showToast('error', "Yükleme iptal edildi.");
            break;
        default:
            showToast('error', "Bilinmeyen bir hata oluştu.");
    }
};

