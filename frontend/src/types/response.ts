export type UserResponse = {
    id: string;
    userName: string;
    createdAt: Date,
    updatedAt: Date,
    accessToken: string,
    refreshToken: string,
}

export type ErrorResponse = {
    error: string;
}