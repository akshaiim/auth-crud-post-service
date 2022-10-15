/* eslint-disable import/no-extraneous-dependencies */

const { describe, expect, it } = require('@jest/globals');

const request = require('supertest');
const app = require('../app');

// before running test cases, register as a user or login if already registered and get a token
// and add the token here in token variable, without valid token Create, update and delete
// tests will fail
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzRhNDdhMjU2NGRhOGI0OGVjZDVhNjkiLCJ1c2VybmFtZSI6ImFrc2hhbWlzaHJhIiwiaWF0IjoxNjY1ODIxMDg4LCJleHAiOjE2NjU4MjI4ODh9._CsHJA6Ox8Dp7JrqzPgagc1EJnPG2WTre_HpeYsSniY';

// test cases to test create,update,delete and get post routes
describe('Post Endpoints', () => {
  // before running add post test change the title to a unique new title
  // else the test will fail due to non-distinct title.
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/posts')
      .send(
        {
          image: 'abcd.jpg',
          title: 'test title new',
          description: ' descriptio',
          tags: ['akshay', 'mishra', 'javspt'],
        },
      ).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('postId');
  });

  it('should return a 422 error as image is not in required format', async () => {
    const res = await request(app)
      .post('/posts')
      .send(
        {
          image: 'abcd.gif',
          title: 'titletest is this',
          description: ' descriptio',
          tags: ['akshay', 'mishra', 'javspt'],
        },
      ).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(422);
  });

  it('should return posts', async () => {
    const res = await request(app)
      .get('/posts');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('posts');
  });

  it('should return posts for added username in query', async () => {
    const res = await request(app)
      .get('/posts').query({ username: 'Auila' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.posts[0]).toMatchObject({ username: 'Auila' });
  });

  it('should return posts created by username in query having added tags', async () => {
    const res = await request(app)
      .get('/posts').query({ username: 'Auila', tags: 'nodejs' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.posts[0]).toMatchObject({ username: 'Auila' });
    expect(res.body.posts[0].tags).toContain('nodejs');
  });

  it('should fail with 401 error due to no-token added', async () => {
    const res = await request(app)
      .patch('/posts').send(
        {
          id: '634a360868c5c3b634b685bf',
          image: 'abcd.jpg',
          title: 'titletest is this',
          description: ' descriptio',
          tags: ['akshay', 'mishra', 'javspt'],
        },
      );
    expect(res.statusCode).toEqual(401);
  });

  it('should update post with post id added in request body', async () => {
    const res = await request(app)
      .patch('/posts').send(
        {
          id: '634a360868c5c3b634b685bf',
          image: 'abcd.jpg',
          title: 'titletest is this',
          description: ' descriptio',
          tags: ['akshay', 'mishra', 'javspt'],
        },
      ).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toMatchObject({ message: 'You\'re not authorised to perform this action.' });
  });

  it('should update post with post id added in request body', async () => {
    const res = await request(app)
      .patch('/posts').send(
        {
          id: '634a63b0f60d3efcd513be9a',
          image: 'abcd.jpg',
          title: 'titletest is thiis',
          description: ' descriptio',
          tags: ['akshay', 'mishra', 'javspt'],
        },
      ).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({ message: 'Post successfully updated.' });
  });

  // make sure to add an id which is present in db, else the test will fail.
  it('should delete the post with id in input.', async () => {
    const res = await request(app)
      .delete('/posts').send(
        {
          id: '634a649af4796b9dadb9bca4',
          image: 'abcd.jpg',
          title: 'titletest is thiis',
          description: ' descriptio',
          tags: ['akshay', 'mishra', 'javspt'],
        },
      ).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({ message: 'Post deleted successfully.' });
  });
});
