import React from 'react';
import {createRoot} from 'react-dom/client';
import AppRoutes from "./AppRoutes";

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error("Root element not found.");
    const newRootElement = document.createElement('div');
    newRootElement.id = 'root';
    document.body.appendChild(newRootElement);
}


if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AppRoutes />
        </React.StrictMode>
    );
}