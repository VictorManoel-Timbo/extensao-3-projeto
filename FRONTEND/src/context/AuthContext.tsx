import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/config/tokenStorage";
import type { AuthUser, LoginRequest, RegisterRequest } from "@/models/auth.model";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasAnamnese: boolean;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  /** Atualiza o gate de anamnese após o usuário concluir o formulário (RN001). */
  markAnamneseDone: () => void;
  setUser: (user: AuthUser) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthUser | null>(() => tokenStorage.getUser());
  const [hasAnamnese, setHasAnamnese] = useState<boolean>(
    () => tokenStorage.getUser()?.has_anamnese ?? false,
  );

  const persistUser = useCallback((next: AuthUser) => {
    tokenStorage.setUser(next);
    setUserState(next);
    setHasAnamnese(next.has_anamnese);
  }, []);

  const login = useCallback(async (body: LoginRequest) => {
    const data = await authService.login(body);
    setUserState(data.user);
    setHasAnamnese(data.has_anamnese);
  }, []);

  const register = useCallback(async (body: RegisterRequest) => {
    const data = await authService.registrar(body);
    setUserState(data.user);
    setHasAnamnese(data.has_anamnese);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUserState(null);
    setHasAnamnese(false);
  }, []);

  const markAnamneseDone = useCallback(() => {
    setHasAnamnese(true);
    const current = tokenStorage.getUser();
    if (current) tokenStorage.setUser({ ...current, has_anamnese: true });
    setUserState((u) => (u ? { ...u, has_anamnese: true } : u));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!tokenStorage.getAccess() && !!user,
      hasAnamnese,
      login,
      register,
      logout,
      markAnamneseDone,
      setUser: persistUser,
    }),
    [user, hasAnamnese, login, register, logout, markAnamneseDone, persistUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
