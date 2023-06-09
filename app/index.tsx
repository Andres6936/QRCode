import React from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./routes/Home";
import '@master/css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    }
], {
    basename: import.meta.env.BASE_URL
})

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
)