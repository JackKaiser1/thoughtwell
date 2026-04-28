import { expect, it, describe } from "vitest";
import request from "supertest";
import { app } from "../../index.js";
import { UserRequestData } from "../../lib/verify-user";
import { UserRecord } from "../../db/schema";
import { deleteUser } from "../../db/queries/users";
import { verifyHash } from "../../api/auth/password.js";
import { type dbClient, db } from "../../db/index.js";


describe("/api/users", () => {
    it.skip("should create user record in db and return UserRecord", async () => {
        try {
            await db.transaction(async (tx) => {
                const payload: UserRequestData = { userName: "guest1", password: "passwordpassword" };

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

                const isVerified = verifyHash(user.hashedPassword, payload.password);

                expect(response.status).toEqual(201)
                expect(user.userName).toBe(payload.userName);
                expect(isVerified).toBeTruthy;
                for (const property in user) {
                    expect(property).toBeTruthy;
                }

                tx.rollback();
            });
        } catch (err) {
            console.log("Rolled back db changes");
        }
    });

    it.skip("should respond with 500 error due to pre-existing record", async () => {

        try {
            await db.transaction(async (tx) => {
                const payload: UserRequestData = { userName: "guest2", password: "passwordpassword" };

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

                const responseCopy = await request(app)
                                    .post("/api/users")
                                    .send(payload)
                                    .set("Accept", "application/json")
                                    .set("Content-Type", "application/json");

                expect(responseCopy.status).toEqual(500);

                tx.rollback();
            });
        } catch (err) {
            console.log("Rolled back db changes");
        }
    });
});