import request from "supertest";
import { app } from "../../index.ts";
import { expect, describe, it } from "vitest";

describe("/api/readiness", () => {
    it("should return 200", async () => {
        const response = await request(app).get("/api/readiness");

        expect(response.status).toBe(200);
        expect(response.text).toBe("OK");
        expect(response.header["content-type"]).toBe("text/plain; charset=utf-8");
    });
});

