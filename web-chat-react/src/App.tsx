import React from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./AppRoutes";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default App;