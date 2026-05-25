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

export type PageResponse = {
    id: string;
    pageContent: string;
    isChild: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export type NotebookResponse = {
    userId: string;
    id: string;
    notebookName: string;
    isChild: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type NotebookContentResponse = {
    pages: PageResponse[],
    notebooks: NotebookResponse[],
}