import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

function apiConfig(baseUrl: string): AxiosRequestConfig {
  return {
    baseURL: baseUrl,
    withCredentials: true,
    auth: {
      username: import.meta.env.VITE_API_USERNAME ?? "",
      password: import.meta.env.VITE_API_PASSWORD ?? "",
    },
  };
}

function initAxios(config: AxiosRequestConfig, token?: any): AxiosInstance {
  const defineInstance = axios.create(config);
  defineInstance.interceptors.request.use(
    (request) => {
      return request;
    },
    (error) => Promise.reject(error),
  );

  defineInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  return defineInstance;
}

function api(baseURL = "http://localhost:8000/api", token?: any) {
  return initAxios(apiConfig(baseURL), token);
}

export default api;
