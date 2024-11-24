import { useSelector } from "react-redux";
import store from "./store"
import { setUser } from "./store/auth";
import React from 'react'
import { Navigate, useLocation } from "react-router-dom";


export const userHendle = data => {
    if (!data) return;

    // Serileştirilebilir özellikleri seç
    const serializedData = {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        phoneNumber: data.phoneNumber,
    };
    store.dispatch(setUser(serializedData))
}


export default function PrivateRoute({ children }) {

    const user = useSelector(state => state.auth.user)
    console.log(user)
    const location = useLocation()

    if (!user) {
        return <Navigate to="/" replace={true} state={{
            return_url: location.pathname
        }}></Navigate>
    }

    return children;
}