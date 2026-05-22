import { type ErrorResponse } from "../types/response.js";

export async function apiErrorHandler(res: Response) {
    const errRes: ErrorResponse = await res.json();
    alert(`${res.status}: ${errRes.error}`);
}

export function printError(err: unknown) {
    if (err instanceof Error) {
        console.log(err.message);
    } else {
        console.log(err);
    }
}