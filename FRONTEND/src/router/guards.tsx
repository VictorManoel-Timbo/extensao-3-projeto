import { Navigate, Outlet } from "react-router-dom";
import Index from "@/pages/Index";
import { useAuth } from "@/hooks/use-auth";

// Rotas só para visitantes (RN007): usuário logado é redirecionado ao chat
export const GuestOnlyRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/chat" replace /> : <Outlet />;
};

// Rotas protegidas (RN007): exige sessão ativa
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Gate de anamnese (RN001): acesso ao chat exige anamnese completa
export const ChatRoute = () => {
  const { hasAnamnese } = useAuth();
  return hasAnamnese ? <Index /> : <Navigate to="/anamnese" replace />;
};
