export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    data: null;
    errors?: string[];
}

export interface ApiError {
    message: string;
    statusCode?: number;
    success: false;
    errors?: string[];
    data: null;
}
