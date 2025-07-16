import axios, {
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/authStore";
import { ApiErrorResponse, ApiSuccessResponse, ApiError } from "@/types/api";

const axiosInstance = axios.create({
    baseURL:
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_URL
            : "http://localhost:8080/api/v1",
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ApiSuccessResponse>) => {
        if (
            response.data &&
            typeof response.data === "object" &&
            "success" in response.data
        ) {
            return response;
        }

        console.warn("Unexpected response structure:", response.data);
        return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
        const user = useAuthStore.getState().user;

        if (error.response) {
            const { status, data } = error.response;

            console.error(`API Error ${status}:`, {
                message: data?.message || "Unknown error",
                errors: data?.errors || [],
                success: data?.success,
            });

            switch (status) {
                case 401:
                    if (user) {
                        useAuthStore.getState().logout();
                    }

                    if (
                        typeof window !== "undefined" &&
                        window.location.pathname !== "/" &&
                        window.location.pathname !== "/login"
                    ) {
                        window.location.href = "/login";
                    }

                    break;
                case 403:
                    console.error("Access forbidden:", data?.message);
                    break;
                case 404:
                    console.error("Resource not found:", data?.message);
                    break;
                case 500:
                    console.error("Internal server error:", data?.message);
                    break;
                default:
                    console.error(
                        `HTTP Error ${status}:`,
                        data?.message || "Unknown error"
                    );
            }
        } else if (error.request) {
            // Network error
            console.error("Network error:", error.message);
        } else {
            // Request setup error
            console.error("Request error:", error.message);
        }

        return Promise.reject(error);
    }
);

// Helper function
export const createApiError = (
    error: AxiosError<ApiErrorResponse>
): ApiError => ({
    message:
        error.response?.data?.message || error.message || "An error occurred",
    statusCode: error.response?.status,
    success: false,
    errors: error.response?.data?.errors || [],
    data: null,
});

// Helper function
export const isApiSuccess = <T>(
    response: unknown
): response is ApiSuccessResponse<T> => {
    return (
        !!response &&
        typeof response === "object" &&
        "success" in response &&
        (response as ApiSuccessResponse<T>).success === true
    );
};

export const getApiData = <T>(
    response: AxiosResponse<ApiSuccessResponse<T>>
): T => {
    return response.data.data;
};

export default axiosInstance;
