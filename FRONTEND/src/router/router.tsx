import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import EsqueciSenha from "@/pages/EsqueciSenha";
import AnamneseGate from "@/pages/AnamneseGate";
import { ChatRoute, GuestOnlyRoute, ProtectedRoute } from "@/router/guards";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    element: <GuestOnlyRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/cadastro", element: <Cadastro /> },
      { path: "/esqueci-senha", element: <EsqueciSenha /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/anamnese", element: <AnamneseGate /> },
      { path: "/chat", element: <ChatRoute /> },
    ],
  },
]);

export default router;
