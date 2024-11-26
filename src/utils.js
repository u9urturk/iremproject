import { useSelector } from "react-redux";
import store from "./store"
import { clearUser, fetchUserRole, setUser } from "./store/auth";
import React from 'react'
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";


export const userHendle = async data => {
    if (!data) {
        store.dispatch(clearUser());
        return;
    }

    // Serileştirilebilir özellikleri seç
    const serializedData = {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        phoneNumber: data.phoneNumber,
    };
    store.dispatch(setUser(serializedData));
    await store.dispatch(fetchUserRole(data.uid));
}


export default function PrivateRoute({ children ,type}) {

    const user = useSelector(state => state.auth.user)
    const isAdmin = useSelector(state => state.auth.isAdmin)

    const location = useLocation()

    switch (type) {
        case "admin":
            if (user && !isAdmin) {
                toast.warning('Yetki dışı erişim isteği saptandı ! İstek bilgileri denetlenecektir.')
                return <Navigate to="/" replace={true} state={{
                    return_url: location.pathname
                }}></Navigate>
            }

            return children;

        default:
            if (!user) {
                return <Navigate to="/" replace={true} state={{
                    return_url: location.pathname
                }}></Navigate>
            }
            return children;
    }


}