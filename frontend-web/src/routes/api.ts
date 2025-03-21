import axios from 'axios';
import { API_BASE_URL } from '../config';

interface ErrorSchema {
    error_message: string;
    error_code: string;
}

interface ApiResponse<T = unknown> {
    output_schema?: T;
    error_schema: ErrorSchema;
}

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
        config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const apiService = {
    get: async <T>(url: string, params = {}): Promise<ApiResponse<T>> => {
      const response = await api.get<ApiResponse<T>>(url, { params });
      return response.data;
    },
  
    post: async <T>(url: string, data: object): Promise<ApiResponse<T>> => {
        const response = await api.post<ApiResponse<T>>(url, data);
        return response.data;
    },
  
    put: async <T>(url: string, data: object): Promise<ApiResponse<T>> => {
      const response = await api.put<ApiResponse<T>>(url, data);
      return response.data;
    },
  
    delete: async <T>(url: string): Promise<ApiResponse<T>> => {
      const response = await api.delete<ApiResponse<T>>(url);
      return response.data;
    },
};



