const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/auth/register - should register a new user and return 201, JWT, and user data without password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    // Should return 201
    expect(res.statusCode).toBe(201);
    // Should return a JWT token
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    // Should return user data without password
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('user');
    const user = res.body.data.user;
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username', 'testuser');
    expect(user).toHaveProperty('email', 'test@example.com');
    expect(user).not.toHaveProperty('password');
  });

  test('POST /api/auth/register - should return 400 if user already exists', async () => {
    // Register once
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    // Register again with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password456'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  test('POST /api/auth/login - should login existing user', async () => {
    // First register
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    
    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});