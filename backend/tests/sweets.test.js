const request = require('supertest');
const app = require('../app');
const Sweet = require('../models/Sweet');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Sweet Endpoints', () => {
  let token;
  let adminToken;
  
  beforeEach(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});
    
    // Create regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    
    token = userRes.body.token;
    
    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true
    });
    
    adminToken = jwt.sign(
      { id: adminUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  });

  test('POST /api/sweets - should create a new sweet (admin only)', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 50
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.sweet).toHaveProperty('name', 'Chocolate Bar');
  });

  test('GET /api/sweets - should get all sweets', async () => {
    // First create a sweet
    await Sweet.create({
      name: 'Test Sweet',
      category: 'Test',
      price: 1.99,
      quantity: 10
    });
    
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.sweets.length).toBe(1);
  });
});