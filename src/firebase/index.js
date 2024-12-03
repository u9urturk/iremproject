import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { toast } from "react-toastify";

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




export const showToast = (type, message) => {
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




export {
    auth,
    db,
    storage
}