import { expect, it, describe } from "vitest";
import request from "supertest";
import { app } from "../../index.js";
import { UserRequestData } from "../../lib/verify-user";
import { UserRecord } from "../../db/schema";
import { deleteUser } from "../../db/queries/users";

describe("/api/users", () => {
    

    it("should create user record in db and return UserRecord", async () => {
        const payload: UserRequestData = { userName: "guest123", password: "passwordpassword" };

        const response = await request(app)
                            .post("/api/users")
                            .send(payload)
                            .set("Accept", "application/json")
                            .set("Content-Type", "application/json");

        const user: UserRecord = response.body;
        if (!user) {
            throw new Error("invalid user");
        }

        const userId = user.id;
        if (!userId) {
            throw new Error("invalid userId");
        }

        expect(response.status).toBe(201)
        expect(response.body).toBe("UserRecord");
        await deleteUser(userId);
    });
});