import { TransactionRollbackError } from "drizzle-orm";

export function rollbackErrorHandler(err: any) {
    if (err instanceof TransactionRollbackError) {
        console.log("database changes rolledback");
    } else if (err instanceof Error) {
        throw new Error(`Error: ${err.message}`);
    } else {
        throw new Error(`Error: ${err}`);
    }
}