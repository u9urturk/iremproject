import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, FacebookAuthProvider } from "firebase/auth";
import { userHendle } from "./utils";
import { Flip, toast } from "react-toastify";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from "firebase/firestore";



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


const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        // İsteğe bağlı: kullanıcı bilgilerini işleyin
        const user = result.user;
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
        // Hata mesajını göster
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
    let data = null
    const listRef = ref(storage, `${tg}/${productId}`);
    await listAll(listRef).then(async (res) => {
        data = res.items

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

export const addProduct = async (productName, rating = 1, price, selectedCategory, selectedColor, selectedFabric, selectedPattern) => {

    try {
        const docRef = await addDoc(collection(db, "products"), {
            productName: productName,
            price: price,
            categoryId: selectedCategory.id,
            colorId: selectedColor.id,
            fabricId: selectedFabric.id,
            patternId: selectedPattern.id,
            rating: rating,
            creationTime: Timestamp.fromDate(new Date())
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
    await signOut(auth);
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


export { auth, signInWithGoogle, signInWithFacebook };


