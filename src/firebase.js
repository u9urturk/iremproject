import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
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
  measurementId: "G-VCQFBWR9ZJ"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();



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

export const downloadImage = async (productId) => {
    let url = null
    const listRef = ref(storage, productId);
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
        }
    });

    return url;

}

export const downloadImages = async (productId) => {
    let data = null;
    const listRef = ref(storage,productId);
    
    await listAll(listRef).then(async (res) => {
        data=res.items
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
        }
    });

   return data;

}




// FireStore Set 
//ProdcutOperations

export const addProduct = async (categoryId, productName, price) => {
    let isSuccess = false;
    await addDoc(collection(db, "products"), {
        categoryId: categoryId,
        productName: productName,
        price: price,
        creationTime: Timestamp.fromDate(new Date())
    }).then(function () {
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
     

        isSuccess = true;
    })

    return isSuccess;
}


export const uploadImage = async (productId, file) => {
    // console.log(productId,file);
    const storageRef = ref(storage, `${productId}/${file.name}`);

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

            if (progress == 0 && snapshot.state == "running") {
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
            } else if (progress == 100 && snapshot.state == "running") {
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

            if (progress == 0 && snapshot.state == "running") {
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
            } else if (progress == 100 && snapshot.state == "running") {
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
    let isSuccess = false
    //console.log(categoryName)
    await addDoc(collection(db, "categories"), {
        categoryName: categoryName,
        creationTime: Timestamp.fromDate(new Date())
    }).then(function () {
        toast.success(`"${categoryName}" isimli kategori başarıyla eklendi. `, {
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

export const deleteCategoryByCategoryId = async (data) => {
    let isSuccess = false
    // console.log(data)

    await deleteDoc(doc(db, "categories", data.categoryId)).then(function () {
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
            if (errorCode === "auth/invalid-email" || errorCode === "auth/wrong-password") {
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
    let isSuccess = false
    //console.log(categoryName)
    await addDoc(collection(db, "colors"), {
        colorName: values.colorName,
        colorCode: values.colorCode,
        creationTime: Timestamp.fromDate(new Date())
    }).then(function () {
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
        

        isSuccess = true;
    })

    return isSuccess;

}

export const deleteColorByColorId = async (data) => {
    let isSuccess = false
    // console.log(data)

    await deleteDoc(doc(db, "categories", data.colorId)).then(function () {
        toast.warning(`"${data.colorName}" isimli kategori başarıyla silindi. `, {
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

export const getColorsByColorId = async (colorId) => {

    const docRef = doc(db, "categories", colorId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}


//Fabric Operations

export const addFabric = async (fabricName) => {
    let isSuccess = false
    //console.log(categoryName)
    await addDoc(collection(db, "fabrics"), {
        fabricName: fabricName,
        creationTime: Timestamp.fromDate(new Date())
    }).then(function () {
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
        

        isSuccess = true;
    })

    return isSuccess;

}


export const deleteFabricByFabricId = async (data) => {
    let isSuccess = false
    // console.log(data)

    await deleteDoc(doc(db, "fabrics", data.fabricId)).then(function () {
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

    const docRef = doc(db, "categories", fabricId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}



//PatternOperations
export const addPattern = async (values) => {
    let isSuccess = false
    //console.log(categoryName)
    await addDoc(collection(db, "colors"), {
        colorName: values.colorName,
        colorCode: values.colorCode,
        creationTime: Timestamp.fromDate(new Date())
    }).then(function () {
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
        

        isSuccess = true;
    })

    return isSuccess;

}

export const deletePatternByPatternId = async (data) => {
    let isSuccess = false
    // console.log(data)

    await deleteDoc(doc(db, "categories", data.colorId)).then(function () {
        toast.warning(`"${data.colorName}" isimli kategori başarıyla silindi. `, {
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

    const first = query(collection(db, "colors"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first)
    return querySnapshot;
}

export const getPatternByPatternId = async (colorId) => {

    const docRef = doc(db, "categories", colorId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}

