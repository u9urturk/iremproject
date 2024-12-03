import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./index.js";
import { toast } from "react-toastify";

async function saveUserToFirestore(userData) {
    const { localId, email, displayName, emailVerified, photoURL } = userData;
    const userRef = doc(db, "users", localId);

    try {
        // Kullanıcının var olup olmadığını kontrol et
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            console.log("Kullanıcı zaten mevcut, tekrar kaydedilmeyecek.");
        } else {
            // Kullanıcı mevcut değilse, yeni bir kayıt oluştur
            await setDoc(userRef, {
                email: email,
                displayName: displayName,
                emailVerified: emailVerified,
                photoURL: photoURL,
                createdAt: new Date().toISOString()
            });
            console.log("Yeni kullanıcı başarıyla kaydedildi.");
        }
    } catch (error) {
        console.error("Kullanıcı kontrol veya kaydetme işleminde hata oluştu: ", error);
    }
}






async function getUsernameByUId(id) {
    try {
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Sadece displayName alanını döndür
            return userSnap.data().displayName || null;
        } else {
            console.log("Kullanıcı bulunamadı.");
            return null;
        }
    } catch (error) {
        console.error("Kullanıcı verisi getirilirken hata oluştu: ", error);
        return null;
    }
}



async function getUserbyId(id) {
    try {
        const userRef = doc(db, "users", id); 
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data(); 
        } else {
            console.log("Kullanıcı bulunamadı.");
            return null;
        }
    } catch (error) {
        console.error("Kullanıcı verisi getirilirken hata oluştu: ", error);
        return null;
    }
}



export const updateUserProfile = async (
    uid,
    {
        displayName,
        email,
        emailVerified,
        phoneNumber,
        phoneVerified,
        county,
        district
    }
) => {
    try {
        // Referans oluştur
        const userRef = doc(db, "users", uid);

        // Güncellenecek verileri hazırla
        const updateData = {};

        // Sadece tanımlı olan alanları güncelleme verisine ekle
        if (displayName !== undefined) updateData.displayName = displayName;
        if (email !== undefined) updateData.email = email;
        if (emailVerified !== undefined) updateData.emailVerified = emailVerified;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (phoneVerified !== undefined) updateData.phoneVerified = phoneVerified;
        if (county !== undefined) updateData.county = county;
        if (district !== undefined) updateData.district = district;

        // Güncelleme timestamp'i ekle
        updateData.updatedAt = new Date().toISOString();

        // Firestore'da güncelleme işlemini gerçekleştir
        await updateDoc(userRef, updateData).then(res => {
            toast.success("Profil bilgileri güncellendi.")
        })

        return {
            success: true,
            message: "Kullanıcı bilgileri başarıyla güncellendi",
            updatedFields: Object.keys(updateData)
        };

    } catch (error) {
        toast.error("Profil bilgileri güncellenemedi !")
        console.log(error.message)
        return {
            success: false,
            message: "Kullanıcı bilgileri güncellenirken bir hata oluştu",
            error: error.message
        };
    }
};


export const checkIsAdmin = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = (await getDoc(docRef)).data();
    return docSnap.role ? docSnap.role === "admin" : false
}




export {
    getUserbyId,
    getUsernameByUId,
    saveUserToFirestore
};