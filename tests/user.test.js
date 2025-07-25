const request = require('supertest');
const { app, serverInstance } = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Routes', () => {
  beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/test-db';
    await mongoose.connect(url, { useNewUrlParser: true });
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    serverInstance.close()
  });

  it('should add a new user', async () => {
    console.log('Running test: should add a new user');
    const res = await request(app)
      .post('/add-user')
      .send({
        name: 'Test User',
        email: 'test@example.com',
      });
    console.log('Response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User added');
    expect(res.body.user).toHaveProperty('name', 'Test User');
  });
});
