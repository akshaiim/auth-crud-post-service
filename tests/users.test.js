/* eslint-disable import/no-extraneous-dependencies */

const { describe, expect, it } = require('@jest/globals');

const request = require('supertest');
const app = require('../app');

// test cases to test user registration and login routes
describe('user registration and login Endpoints', () => {
  // before running the test change the username and email to a new unique value,
  // else the test will fail..
  it('should create a new user and return token.', async () => {
    const res = await request(app)
      .post('/user/register')
      .send(
        {
          username: 'akshamishra123',
          email: 'akshaym123@dummy.com',
          password: 'akshay123',
        },
      );
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail as the added username and email is not unique.', async () => {
    const res = await request(app)
      .post('/user/register')
      .send(
        {
          username: 'akshamishra123',
          email: 'akshaym123@dummy.com',
          password: 'akshay123',
        },
      );
    expect(res.statusCode).toEqual(409);
  });

  it('should login a user and return token.', async () => {
    const res = await request(app)
      .post('/user/login')
      .send(
        {
          email: 'akshaym123@dummy.com',
          password: 'akshay123',
        },
      );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
