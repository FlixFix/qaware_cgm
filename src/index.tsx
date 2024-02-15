import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShellComponent } from "./AppShell";
import { DashboardPage } from "./DashboardPage";
import { SettingsPage } from "./SettingsPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./fonts/fonts.scss";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShellComponent>
            <DashboardPage/>
        </AppShellComponent>
    },
    {
        path: "/settings",
        element: <AppShellComponent>
            <SettingsPage/>
        </AppShellComponent>
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
        <ToastContainer/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
