export type LoginUserResponse = {
    id: string;
    userName: string;
    createdAt: Date,
    updatedAt: Date,
    accessToken: string,
    refreshToken: string,
}

export type CreateUserResponse = {
    id: string,
    userName: string,
    createdAt: Date,
    updatedAt: Date,
}

export type ErrorResponse = {
    error: string;
}