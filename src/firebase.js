import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, FacebookAuthProvider } from "firebase/auth";
import { userHendle } from "./utils";
import { Flip, toast } from "react-toastify";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, increment, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyBssFu2VLMd1kXD99rb-TvFxBXXelCf_Ws",
    authDomain: "iremceyizevi-6265d.firebaseapp.com",
    projectId: "iremceyizevi-6265d",
    storageBucket: "iremceyizevi-6265d.appspot.com",
    messagingSenderId: "398714082560",
    appId: "1:398714082560:web:c8ce37c349b03d710a8fe5",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();


// Sepet Operasyonları
// Sepete Ürün Ekleme
export const addToCartFb = async (userId, productId, productData, quantity = 1, baseImage) => {
    try {
        const cartRef = doc(db, "users", userId, "cart", productId);
        // Ürünün mevcut olup olmadığını kontrol et
        const existingProductSnap = await getDoc(cartRef);

        if (existingProductSnap && existingProductSnap.exists()) {
            // Ürün zaten varsa miktarını artır
            await updateDoc(cartRef, {
                quantity: increment(quantity),
                updatedAt: new Date().toISOString()
            })
        } else {
            // Ürün yoksa yeni bir ürün olarak ekle
            const newCartItem = {
                ...productData,
                quantity: quantity,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                baseImage: baseImage
            };
            await setDoc(cartRef, newCartItem);
        }
        showToast('success', 'Ürün sepete başarıyla eklendi');
        return { success: true ,documentId: cartRef.id };
    } catch (error) {
        showToast('error', 'Ürün sepete eklenirken bir hata oluştu');
        console.error('Add to Cart Error:', error);
    }
};

// Sepeti Getirme
export const getCart = async (userId) => {
    try {
        const cartRef = collection(db, "users", userId, "cart");
        const cartSnap = await getDocs(cartRef);

        const cartItems = cartSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, cartItems };
    } catch (error) {
        showToast('error', 'Sepet getirilirken bir hata oluştu');
        console.error('Get Cart Error:', error);
    }
};

// Sepetteki Ürünü Güncelleme
export const updateCartItem = async (userId, productId, quantity) => {
    try {
        const cartRef = doc(db, "users", userId, "cart", productId);

        if (quantity > 0) {
            // Miktar güncelle
            await updateDoc(cartRef, {
                quantity: quantity,
                updatedAt: new Date().toISOString()
            });
            showToast('success', 'Sepet öğesi başarıyla güncellendi');
        } else {
            // Miktar sıfır veya daha az ise ürünü sepetten çıkar
            await deleteDoc(cartRef);
            showToast('success', 'Ürün sepetten çıkarıldı');
        }
        return { success: true };
    } catch (error) {
        showToast('error', 'Sepet güncellenirken bir hata oluştu');
        console.error('Update Cart Item Error:', error);
    }
};

// Sepetten Ürün Silme
export const removeCartItem = async (userId, productId) => {
    try {
        const cartRef = doc(db, "users", userId, "cart", productId);

        await deleteDoc(cartRef);
        showToast('success', 'Ürün sepetten başarıyla çıkarıldı');
        return { success: true };
    } catch (error) {
        showToast('error', 'Ürün sepetten çıkarılırken bir hata oluştu');
        console.error('Remove Cart Item Error:', error);
    }
};

// Sepeti Temizleme
export const clearCartFb = async (userId) => {
    try {
        const cartRef = collection(db, "users", userId, "cart");
        const cartSnap = await getDocs(cartRef);
        // const batch = db.batch();
        cartSnap.docs.forEach((doc) => removeCartItem(userId, doc.id));
        // await batch.commit();

        showToast('success', 'Sepet başarıyla temizlendi');
        return { success: true };
    } catch (error) {
        showToast('error', 'Sepet temizlenirken bir hata oluştu');
        console.error('Clear Cart Error:', error);
    }
};


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
        const userRef = doc(db, "users", id); // "users" koleksiyonundan belirli bir belgeye referans oluşturulur
        const userSnap = await getDoc(userRef); // Belgeyi getirir

        if (userSnap.exists()) {
            return userSnap.data(); // Kullanıcı verilerini döndür
        } else {
            console.log("Kullanıcı bulunamadı.");
            return null;
        }
    } catch (error) {
        console.error("Kullanıcı verisi getirilirken hata oluştu: ", error);
        return null;
    }
}

async function addComment(data) {
    const db = getFirestore();
    console.log(data)
    try {
        const docRef = await addDoc(collection(db, "comments"), data)
        toast.success('Yorum başarıyla eklendi!');
        return {
            id: docRef.id,
            customerName: data.customerName,
            comment: data.comment,
            date: new Date(data.date).toLocaleDateString('tr-TR'),
            rating: data.rating
        }
    } catch (e) {
        toast.error('Yorum eklenirken hata oluştu!');
        console.error("Yorum eklenirken hata oluştu: ", e);

    }
}



async function getCommentsByProductId(productId) {
    const db = getFirestore();
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



const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log(user)

        // Firestore'a kullanıcı verisini kaydet
        await saveUserToFirestore({
            localId: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL
        });

        toast.success(`Hoş geldin ${user.displayName}`, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });

        return user;
    } catch (error) {
        console.error("Google ile giriş hatası: ", error);
        toast.error(`Google ile giriş hatası: ${"Giriş yapılamadı"}`, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });
    }
};

const signInWithFacebook = async () => {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        // İsteğe bağlı: kullanıcı bilgilerini işleyin
        const user = result.user;
        toast.success("Facebook ile giriş başarılı!", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });
        return user;
    } catch (error) {
        // Hata mesajını göster
        console.error("Facebook ile giriş hatası: ", error);
        toast.error(`Facebook ile giriş hatası: ${error.message}`, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });
    }
};

onAuthStateChanged(auth, user => {
    userHendle(user || false)
});

export const getStoragebase = () => {
    return storage;
}



// FireStore Get 
//Categories

export const getCategories = async () => {

    const first = query(collection(db, "categories"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first)
    return querySnapshot;
}

export const isAdmin = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = (await getDoc(docRef)).data();
    return docSnap.role ? docSnap.role === "admin" : "customer"
}


//AddressOperations

const showToast = (type, message) => {
    const toastConfig = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    };

    switch (type) {
        case 'success':
            toast.success(message, toastConfig);
            break;
        case 'error':
            toast.error(message, toastConfig);
            break;
        case 'warning':
            toast.warning(message, toastConfig);
            break;
        default:
            toast.info(message, toastConfig);
    }
};

//Sipariş Operasyonları

// Sipariş Ekleme (Create Order)
export const createOrder = async (userId, orderData) => {
    try {
        const ordersRef = collection(db, "users", userId, "orders");

        const newOrder = {
            ...orderData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await addDoc(ordersRef, newOrder);
        showToast('success', 'Sipariş başarıyla eklendi');

        return {
            success: true,
            orderId: docRef.id,
            order: newOrder
        };
    } catch (error) {
        showToast('error', 'Sipariş eklenirken bir hata oluştu');
        console.error('Create Order Error:', error);
        throw error;
    }
};

// Tek Sipariş Okuma (Read Order)
export const readOrder = async (userId, orderId) => {
    try {
        const orderRef = doc(db, "users", userId, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
            showToast('success', 'Sipariş başarıyla getirildi');
            return {
                success: true,
                order: orderSnap.data()
            };
        } else {
            showToast('error', 'Sipariş bulunamadı');
            return { success: false, order: null };
        }
    } catch (error) {
        showToast('error', 'Sipariş getirilirken bir hata oluştu');
        console.error('Read Order Error:', error);
        throw error;
    }
};

// Sipariş Güncelleme (Update Order)
export const updateOrder = async (userId, orderId, updatedData) => {
    try {
        const orderRef = doc(db, "users", userId, "orders", orderId);

        await updateDoc(orderRef, {
            ...updatedData,
            updatedAt: new Date().toISOString()
        });

        showToast('success', 'Sipariş başarıyla güncellendi');
        return { success: true };
    } catch (error) {
        showToast('error', 'Sipariş güncellenirken bir hata oluştu');
        console.error('Update Order Error:', error);
        throw error;
    }
};

// Sipariş Silme (Delete Order)
export const deleteOrder = async (userId, orderId) => {
    try {
        const orderRef = doc(db, "users", userId, "orders", orderId);

        await deleteDoc(orderRef);
        showToast('success', 'Sipariş başarıyla silindi');

        return { success: true };
    } catch (error) {
        showToast('error', 'Sipariş silinirken bir hata oluştu');
        console.error('Delete Order Error:', error);
        throw error;
    }
};

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



//UserOperations

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

export const getUserByUid = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = (await getDoc(docRef)).data();
    return docSnap;
}

export const getCategoryByCategoryId = async (categoryId) => {

    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}


//Products

export const getProducts = async () => {

    const first = query(collection(db, "products"), orderBy("creationTime", "desc"));
    const querySnapshot = await getDocs(first)
    return querySnapshot;
}

export const getProductByCategoryId = async (categoryId) => {
    const q = query(collection(db, "products"), where("categoryId", "==", categoryId));

    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

export const getProductByProductId = async (productId) => {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}

export const downloadImage = async (tg, productId) => {
    let url = null
    const listRef = ref(storage, `${tg}/${productId}`);
    await listAll(listRef).then(async (res) => {
        await getDownloadURL(ref(storage, res.items[0].fullPath))
            .then((path) => {
                url = path
            })
    }).catch((error) => {
        switch (error.code) {
            case 'storage/object-not-found':
                // File doesn't exist
                break;
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
                // User canceled the upload
                break;

            // ...

            case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;

            default:
                // default code
                break;
        }
    });

    return url;

}

export const downloadImages = async (tg, productId) => {
    const data = []
    const listRef = ref(storage, `${tg}/${productId}`);
    await listAll(listRef).then(async (res) => {
        res.items.forEach(e => {
            getDownloadURL(ref(storage, e.fullPath))
                .then((path) => {
                    data.push(path)
                })
        });

    }).catch((error) => {
        switch (error.code) {
            case 'storage/object-not-found':
                // File doesn't exist
                break;
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
                // User canceled the upload
                break;

            // ...

            case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;

            default:
                // default code
                break;
        }
    });
    return data;

}




// FireStore Set 
//ProdcutOperations

export const addProduct = async (productName, rating = 1, price, explanation, selectedCategory, selectedColor, selectedFabric, selectedPattern) => {
    console.log(explanation)
    try {
        const docRef = await addDoc(collection(db, "products"), {
            productName: productName,
            price: price,
            categoryId: selectedCategory.id,
            colorId: selectedColor.id,
            fabricId: selectedFabric.id,
            patternId: selectedPattern.id,
            rating: rating,
            creationTime: Timestamp.fromDate(new Date()),
            explanation: explanation
        })
        toast.success(`"${productName}" isimli ürün başarıyla eklendi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });

        return { id: docRef.id }; // Burada docRef kullanılıyor
    } catch (error) {
        console.error("Error adding document: ", error);
        // Hata durumunda bir hata bildirimi göstermek isterseniz:
        toast.error("Ürün eklenirken bir hata oluştu.", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });
    }


}

export const deleteProductByProductId = async (data) => {
    let isSuccess = false

    await deleteDoc(doc(db, "products", data.productId)).then(function () {
        toast.warning(`"${data.productName}" isimli renk başarıyla silindi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });


        isSuccess = true;
    })

    return isSuccess;

}


export const uploadImage = async (target = null, productId, file) => {
    let storageRef = null;
    if (target !== null) {
        storageRef = ref(storage, `${target}/${productId}/${file.name}`)
    } else {
        storageRef = ref(storage, `${productId}/${file.name}`);
    }


    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            if (progress === 0 && snapshot.state === "running") {
                toast.info("Yükleniyor... ",
                    {
                        position: "top-left",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: progress,
                        theme: "colored",
                        transition: Flip
                    })
            } else if (progress === 100 && snapshot.state === "running") {
                toast.success("Başarıyla Yüklendi", {
                    position: "top-left",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip
                })

            }

        },
        (error) => {
            console.log(error)
        },
        //   () => {
        //     // Handle successful uploads on complete
        //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //       console.log('File available at', downloadURL);
        //     });
        //   }
    );

}


export const uploadImageBilboard = async (file) => {
    // console.log(productId,file);
    const storageRef = ref(storage, `${"bilboard"}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            if (progress === 0 && snapshot.state === "running") {
                toast.info("Yükleniyor... ",
                    {
                        position: "top-left",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Flip
                    })
            } else if (progress === 100 && snapshot.state === "running") {
                toast.success("Başarıyla Yüklendi", {
                    position: "top-left",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip
                })

            }

        },
        (error) => {
            console.log(error)
        },
        //   () => {
        //     // Handle successful uploads on complete
        //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //       console.log('File available at', downloadURL);
        //     });
        //   }
    );

}



//CategoryOperations
export const addCategory = async (categoryName) => {
    try {
        const docRef = await addDoc(collection(db, "categories"), {
            name: categoryName,
            creationTime: Timestamp.fromDate(new Date())
        });

        toast.success(`"${categoryName}" isimli kumaş başarıyla eklendi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });

        return { id: docRef.id }; // Burada docRef kullanılıyor
    } catch (error) {
        console.error("Error adding document: ", error);
        // Hata durumunda bir hata bildirimi göstermek isterseniz:
        toast.error("Renk eklenirken bir hata oluştu.", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });
    }



}

export const deleteCategoryByCategoryId = async (data) => {
    let isSuccess = false

    await deleteDoc(doc(db, "categories", data.id)).then(function () {
        toast.warning(`"${data.categoryName}" isimli kategori başarıyla silindi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });


        isSuccess = true;
    })

    return isSuccess;

}

export const updateCategoryByCategoryId = async (categoryId, categoryName) => {
    let isSuccess = false


    const washingtonRef = doc(db, "categories", categoryId);

    await updateDoc(washingtonRef, {
        categoryName: categoryName
    }).then(function () {
        toast.warning(`Mevcut kategori "${categoryName}" ismiyle güncellendi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });



        isSuccess = true;
    })

    return isSuccess;
}



// Login - Logout 
export const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            toast.success("Giriş Başarılı",
                {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip
                })
        })
        .catch((error) => {
            console.log(error.code)
            const errorCode = error.code;
            if (errorCode) {
                toast.error('Kullanıcı giriş bilgileri hatalı !', {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip
                });
            }
        })

}



export const logout = async () => {
    await signOut(auth).then(res => {
        userHendle(null);
    })
    toast.info("Oturum Kapatıldı", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip
    })
    return true
}



//ColorOperations
export const addColor = async (values) => {
    try {
        const docRef = await addDoc(collection(db, "colors"), {
            name: values.colorName,
            colorCode: values.colorCode,
            creationTime: Timestamp.fromDate(new Date())
        });

        toast.success(`"${values.colorName}" isimli renk başarıyla eklendi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });

        return { id: docRef.id }; // Burada docRef kullanılıyor
    } catch (error) {
        console.error("Error adding document: ", error);
        // Hata durumunda bir hata bildirimi göstermek isterseniz:
        toast.error("Renk eklenirken bir hata oluştu.", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });
    }


}

export const deleteColorByColorId = async (data) => {
    let isSuccess = false

    await deleteDoc(doc(db, "colors", data.colorId)).then(function () {
        toast.warning(`"${data.name}" isimli renk başarıyla silindi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });


        isSuccess = true;
    })

    return isSuccess;

}

export const getColors = async () => {

    const first = query(collection(db, "colors"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first)
    return querySnapshot;
}

export const getColorByColorId = async (colorId) => {

    const docRef = doc(db, "colors", colorId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}


//Fabric Operations

export const addFabric = async (fabricName) => {
    try {
        const docRef = await addDoc(collection(db, "fabrics"), {
            name: fabricName,
            creationTime: Timestamp.fromDate(new Date())
        });

        toast.success(`"${fabricName}" isimli kumaş başarıyla eklendi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });

        return { id: docRef.id }; // Burada docRef kullanılıyor
    } catch (error) {
        console.error("Error adding document: ", error);
        // Hata durumunda bir hata bildirimi göstermek isterseniz:
        toast.error("Renk eklenirken bir hata oluştu.", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });
    }


}


export const deleteFabricByFabricId = async (data) => {
    let isSuccess = false
    // console.log(data)

    await deleteDoc(doc(db, "fabrics", data.id)).then(function () {
        toast.warning(`"${data.fabricName}" isimli kumaş başarıyla silindi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });


        isSuccess = true;
    })

    return isSuccess;

}

export const getAllFabrics = async () => {

    const first = query(collection(db, "fabrics"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first)
    return querySnapshot;
}

export const getFabricsByFabricId = async (fabricId) => {

    const docRef = doc(db, "fabrics", fabricId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}








//PatternOperations
export const addPattern = async (values) => {
    try {
        const docRef = await addDoc(collection(db, "patterns"), {
            name: values.patternName,
            creationTime: Timestamp.fromDate(new Date())
        });
        const id = docRef.id

        await uploadImage('patterns', id, values.file)

        toast.success(`"${values.patternName}" isimli kumaş başarıyla eklendi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });

        return id; // Burada docRef kullanılıyor
    } catch (error) {
        console.error("Error adding document: ", error);
        // Hata durumunda bir hata bildirimi göstermek isterseniz:
        toast.error("Renk eklenirken bir hata oluştu.", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });
    }

}

export const deletePatternByPatternId = async (data) => {
    let isSuccess = false
    // console.log(data)

    await deleteDoc(doc(db, "patterns", data.id)).then(function () {
        toast.warning(`"${data.patternName}" isimli desen başarıyla silindi. `, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip
        });


        isSuccess = true;
    })

    return isSuccess;

}

export const getPatterns = async () => {

    const first = query(collection(db, "patterns"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first)
    return querySnapshot;
}

export const getPatternByPatternId = async (colorId) => {

    const docRef = doc(db, "patterns", colorId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}


export {
    auth, signInWithGoogle,
    signInWithFacebook,
    addComment,
    getCommentsByProductId,
    getUserbyId,
    getUsernameByUId,
};


