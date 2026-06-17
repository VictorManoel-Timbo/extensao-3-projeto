import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import AnamneseGate from "@/pages/AnamneseGate";
import { ChatRoute, GuestOnlyRoute, LandingRoute, ProtectedRoute } from "@/router/guards";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingRoute />,
  },
  {
    element: <GuestOnlyRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/cadastro", element: <Cadastro /> },
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
