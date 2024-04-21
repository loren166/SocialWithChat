import React from 'react';
import {Routes, Route, Navigate} from "react-router-dom";
import {authRoutes, publicRoutes} from "./Routes";

const AppRoutes = () => {
    const isAuth = false;

    return (
        <Routes>
            {isAuth && authRoutes.map(({ path, component }) => (
                <Route key={path} path={path} element={component} />
            ))}
            {publicRoutes.map(({ path, component }) => (
                <Route key={path} path={path} element={component} />
            ))}
            <Navigate to={isAuth ? "/Profile" : "/login"} />
        </Routes>
    );
};

export default AppRoutes;