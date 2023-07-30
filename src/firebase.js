import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { userHendle } from "./utils";
import { Flip, toast } from "react-toastify";
import { Timestamp, addDoc, collection, doc, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyAOXcyZevHShLVZOOA-pHlrAs33GNitz8E",
    authDomain: "iremnakis-144a2.firebaseapp.com",
    projectId: "iremnakis-144a2",
    storageBucket: "iremnakis-144a2.appspot.com",
    messagingSenderId: "848842595220",
    appId: "1:848842595220:web:9e91bec59831aab645cd81",
    measurementId: "G-S421CPS54N"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);



onAuthStateChanged(auth, user => {
    userHendle(user || false)
});



// FireStore Get 


export const getCategories = async () => {

    const first = query(collection(db, "categories"), orderBy("creationTime", "asc"));
    const querySnapshot = await getDocs(first)
    return querySnapshot;
}




// FireStore Set 

export const addCategory = async(categoryName)=>{
    console.log(categoryName)
    await addDoc(collection(db, "categories" ), {
        categoryName: categoryName,
        creationTime:Timestamp.fromDate(new Date())
      }).then(function(){
        toast.success(`"${categoryName}" isimli kategori başarıyla eklendi. `, {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition:Flip
            });
      })
      
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
            const errorCode = error.code;
            if (errorCode === "auth/invalid-email") {
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
    toast.info("Oturum Kapatıldı",{
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