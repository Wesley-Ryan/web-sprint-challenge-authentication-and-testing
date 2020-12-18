const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

const invalidUser = { username: "RickJames" };
const validUser = { username: "RickJames", password: "password" };

describe("Authentication Endpoints", () => {
  describe("[POST] REGISTER", () => {
    it("/register responds with 200 if username and password are valid", async () => {
      const response = await request(server)
        .post("/api/auth/register")
        .send(validUser);
      expect(response.status).toBe(201);
    });
    it("/register responds with '' if missing fields", async () => {
      const response = await request(server)
        .post("/api/auth/register")
        .send(invalidUser);
      expect(JSON.stringify(response.body)).toMatch(
        /username and password required/
      );
    });
  });
  describe("[POST] LOGIN", () => {
    it("/login responds with token if user is registerd", async () => {
      const register = await request(server)
        .post("/api/auth/register")
        .send(validUser);
      const res = await request(server).post("/api/auth/login").send(validUser);
      expect(res.body.token).toHaveLength(175);
    });
    it("/login responds with 'invalid credentials' if not registered", async () => {
      const res = await request(server).post("/api/auth/login").send(validUser);
      expect(JSON.stringify(res.body)).toMatch(/invalid credentials/);
    });
  });
});
