import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api"

export function extractErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        return (
            axiosError.response?.data?.message ??
            axiosError.message ??
            "Something went wrong"
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred";
}

function isAxiosError(error: unknown): error is AxiosError {
    return (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as AxiosError).isAxiosError === true
    );
}
