import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db, showToast } from "./index.js";

// Yeni adres ekleme
export const createAddress = async (userId, addressData) => {
    try {
        const addressesRef = collection(db, "users", userId, "addresses");

        const newAddress = {
            ...addressData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await addDoc(addressesRef, newAddress);
        showToast('success', 'Adres başarıyla eklendi');

        return {
            success: true,
            addressId: docRef.id,
            address: newAddress
        };
    } catch (error) {
        showToast('error', 'Adres eklenirken bir hata oluştu');
        console.error('Create Address Error:', error);
    }
};

// Kullanıcının tüm adreslerini getirme
export const getUserAddresses = async (userId) => {
    try {
        const addressesRef = collection(db, "users", userId, "addresses");
        const querySnapshot = await getDocs(addressesRef);

        const addresses = [];
        querySnapshot.forEach((doc) => {
            addresses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return {
            success: true,
            addresses: addresses
        };
    } catch (error) {
        showToast('error', 'Adresler yüklenirken bir hata oluştu');
        console.error('Get Addresses Error:', error);
    }
};

// Tek bir adresi getirme
export const getAddressById = async (userId, addressId) => {
    try {
        const addressRef = doc(db, "users", userId, "addresses", addressId);
        const addressDoc = await getDoc(addressRef);

        if (!addressDoc.exists()) {
            showToast('warning', 'Adres bulunamadı');
            return {
                success: false
            };
        }

        return {
            success: true,
            address: {
                id: addressDoc.id,
                ...addressDoc.data()
            }
        };
    } catch (error) {
        showToast('error', 'Adres bilgileri alınırken bir hata oluştu');
        console.error('Get Address Error:', error);
    }
};

//Varsayılan adresi getir 
export const getDefaultAddress = async (userId) => {
    try {
        // Kullanıcının adresler koleksiyonuna sorgu
        const addressesRef = collection(db, "users", userId, "addresses");
        const q = query(addressesRef, where("isDefault", "==", true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            showToast('warning', 'Varsayılan adres bulunamadı');
            return {
                success: false
            };
        }

        // İlk varsayılan adresi döndür
        const defaultAddressDoc = querySnapshot.docs[0];
        return {
            success: true,
            address: {
                id: defaultAddressDoc.id,
                ...defaultAddressDoc.data()
            }
        };
    } catch (error) {
        showToast('error', 'Varsayılan adres alınırken bir hata oluştu');
        console.error('Get Default Address Error:', error);
        throw error;
    }
};

// Adres güncelleme
export const updateAddress = async (userId, addressId, updateData) => {
    try {
        const addressRef = doc(db, "users", userId, "addresses", addressId);

        const updates = {
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await updateDoc(addressRef, updates);
        showToast('success', 'Adres başarıyla güncellendi');

        return {
            success: true,
            updatedFields: Object.keys(updateData)
        };
    } catch (error) {
        showToast('error', 'Adres güncellenirken bir hata oluştu');
        console.error('Update Address Error:', error);
        throw error;
    }
};

// Adres silme
export const deleteAddress = async (userId, addressId) => {
    try {
        const addressRef = doc(db, "users", userId, "addresses", addressId);
        await deleteDoc(addressRef);

        showToast('success', 'Adres başarıyla silindi');

        return {
            success: true,
            deletedAddressId: addressId
        };
    } catch (error) {
        showToast('error', 'Adres silinirken bir hata oluştu');
        console.error('Delete Address Error:', error);
        throw error;
    }
};

// Varsayılan adres ayarlama
export const setDefaultAddress = async (userId, addressId) => {
    try {
        // Önce tüm adresleri varsayılan olmaktan çıkar
        const addressesRef = collection(db, "users", userId, "addresses");
        const q = query(addressesRef, where("isDefault", "==", true));
        const querySnapshot = await getDocs(q);

        const batch = [];
        querySnapshot.forEach((doc) => {
            const addressRef = doc(db, "users", userId, "addresses", doc.id);
            batch.push(updateDoc(addressRef, { isDefault: false }));
        });

        await Promise.all(batch);

        // Seçilen adresi varsayılan yap
        const newDefaultAddressRef = doc(db, "users", userId, "addresses", addressId);
        await updateDoc(newDefaultAddressRef, {
            isDefault: true,
            updatedAt: new Date().toISOString()
        });

        showToast('success', 'Varsayılan adres güncellendi');

        return {
            success: true,
            defaultAddressId: addressId
        };
    } catch (error) {
        showToast('error', 'Varsayılan adres ayarlanırken bir hata oluştu');
        console.error('Set Default Address Error:', error);
        throw error;
    }
};