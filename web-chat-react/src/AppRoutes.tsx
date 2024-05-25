import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { REGISTER_PAGE, LOGIN_PAGE, CHAT_PAGE } from './utils/consts';

const localUserId = localStorage.getItem('userId');

const AppRoutes = () => {
    const isAuth = localUserId !== null;

    return (
        <Router>
            <Routes>
                {isAuth ? (
                    <>
                        <Route path={`${CHAT_PAGE}/:chatId?`} element={<Chat userId={localUserId!} chatName="" />} />
                        <Route path="/" element={<Navigate to={CHAT_PAGE} />} />
                    </>
                ) : (
                    <Route path="/" element={<Navigate to={LOGIN_PAGE} />} />
                )}
                <Route path={LOGIN_PAGE} element={<Login />} />
                <Route path={REGISTER_PAGE} element={<Register />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;