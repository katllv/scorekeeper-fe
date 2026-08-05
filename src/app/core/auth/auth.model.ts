export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    displayName?: string;
}

export interface UserResponse {
    id: string;
    username: string;
    displayName?: string;
}

