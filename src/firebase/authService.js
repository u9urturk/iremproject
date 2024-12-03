import { FacebookAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { saveUserToFirestore } from "./userService";
import { Flip, toast } from "react-toastify";
import { auth, showToast } from "./index.js";
import { userHandle } from "../utils.js";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();


onAuthStateChanged(auth, user => {
    userHandle(user || false)
});


const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        await saveUserToFirestore({
            localId: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL
        });

     showToast('success',`Hoş geldin ${user.displayName}`)

        return user;
    } catch (error) {
        console.error("Google ile giriş hatası: ", error);
       showToast('error','Google ile giriş yapılamadı !')
    }
};

const signInWithFacebook = async () => {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        showToast('success','Giriş başarılı')
        return user;
    } catch (error) {
        console.error("Facebook ile giriş hatası: ", error);
       showToast('error','Facebook ile bağlantı kurulamadı !')
    }
};



export const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showToast('success','Giriş Başarılı')
        })
        .catch((error) => {
            const errorCode = error.code;
            console.log(errorCode)
            showToast('error','Kullanıcı giriş bilgileri hatalı !')
        })

}


export const logout = async () => {
    await signOut(auth).then(res => {
        userHandle(null);
    })
    showToast("",'Oturum kapatıldı');

    return true
}




export {
    signInWithFacebook,
    signInWithGoogle
}