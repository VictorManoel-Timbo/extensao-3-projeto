import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "./tokenStorage";
import type { TokenPair } from "@/models/auth.model";

const REFRESH_URL = "/auth/token/refresh/";
// Endpoints que nunca devem receber Authorization nem disparar refresh
const AUTH_PUBLIC_PATHS = ["/auth/login/", "/auth/register/", REFRESH_URL];

function apiConfig(baseUrl: string): AxiosRequestConfig {
  return {
    baseURL: baseUrl,
    withCredentials: true,
  };
}

const isAuthPublic = (url?: string): boolean =>
  !!url && AUTH_PUBLIC_PATHS.some((p) => url.includes(p));

// Garante uma única chamada de refresh concorrente
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(baseURL: string): Promise<string> {
  if (refreshPromise) return refreshPromise;

  const refresh = tokenStorage.getRefresh();
  if (!refresh) return Promise.reject(new Error("Sem refresh token"));

  refreshPromise = axios
    .post<TokenPair>(`${baseURL}${REFRESH_URL}`, { refresh }, { withCredentials: true })
    .then((res) => {
      const { access, refresh: newRefresh } = res.data;
      tokenStorage.setTokens(access, newRefresh ?? refresh);
      return access;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function handleAuthFailure(): void {
  tokenStorage.clear();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

function initAxios(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config);
  const baseURL = (config.baseURL as string) ?? "/api";

  instance.interceptors.request.use(
    (request) => {
      const access = tokenStorage.getAccess();
      if (access && !isAuthPublic(request.url)) {
        request.headers.Authorization = `Bearer ${access}`;
      }
      return request;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;

      if (
        error.response?.status === 401 &&
        original &&
        !original._retry &&
        !isAuthPublic(original.url)
      ) {
        original._retry = true;
        try {
          const access = await refreshAccessToken(baseURL);
          original.headers.Authorization = `Bearer ${access}`;
          return instance(original);
        } catch {
          handleAuthFailure();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

function api(baseURL = "/api") {
  return initAxios(apiConfig(baseURL));
}

export default api;
