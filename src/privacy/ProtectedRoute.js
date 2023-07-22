import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useSelector} from "react-redux";

export const ProtectedRoute = ({ redirectTo }) => {
    const isLogin = useSelector(store => store.auth.isAuth);
    return isLogin ? <Outlet /> : <Navigate to={redirectTo} />;
};