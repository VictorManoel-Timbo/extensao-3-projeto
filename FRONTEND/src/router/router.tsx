import {createBrowserRouter, Navigate, Outlet} from "react-router-dom";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import EsqueciSenha from "@/pages/EsqueciSenha";

export const isAuthenticated = () => sessionStorage.getItem("fg_auth") === "true"

const ProtectedRoute = () => isAuthenticated() ? <Index/> : <Landing/>

const GuestOnlyRout = () => isAuthenticated() ? <Navigate to="/chat" replace/> : <Outlet/>

const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing/>
    },
    {
        element: <GuestOnlyRout/>,
        children: [
            {
                path: "/login",
                element: <Login/>
            },
            {
                path: "/cadastro",
                element: <Cadastro/>
            },
            {
                path: "/esqueci-senha",
                element: <EsqueciSenha/>
            }
        ]
    },
    {
        element: <ProtectedRoute/>,
        children: [
            {
                path: "/chat",
                element: <Index/>
            }
        ]
    }
])

export default router