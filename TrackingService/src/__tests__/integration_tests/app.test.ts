import { app } from '../../app';
import { User } from '../../types/user';

const request = require('supertest');

describe("Testing /", () => {
  it("It should response the GET method", async () => {
    const response = await request(app).get("/0?data=test");
    expect(response.statusCode).toBe(200);
	const user = response.body.user as User;
	const expectedUser = {accountId: 0, accountName: "Klemen", isActive: true} as User;
	expect(user).toEqual(expectedUser);
	expect(response.body.data).toEqual("test");
  });
  it("It should response the GET method", async () => {
    const response = await request(app).get("/3?data=test");
    expect(response.statusCode).toBe(500);
  });
});
