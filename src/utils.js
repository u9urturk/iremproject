import { useSelector } from "react-redux";
import store from "./store"
import { setUser } from "./store/auth";
import React from 'react'
import { Navigate, useLocation } from "react-router-dom";


export const userHendle = data => {
    store.dispatch(setUser(data))
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