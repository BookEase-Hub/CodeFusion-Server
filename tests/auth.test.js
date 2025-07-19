const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register with invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should login a registered user', async () => {
    await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get the current user', async () => {
    const registerRes = await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    const token = registerRes.body.token;

    const res = await request(app)
      .get('/api/v1/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should update the user profile', async () => {
    const registerRes = await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    const token = registerRes.body.token;

    const res = await request(app)
      .put('/api/v1/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
        bio: 'This is a bio'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated User');
    expect(res.body).toHaveProperty('bio', 'This is a bio');
  });
});
