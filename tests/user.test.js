const request = require('supertest');
const { app, serverInstance } = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  serverInstance.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Routes', () => {
  it('should add a new user with only a name', async () => {
    const res = await request(app)
      .post('/add-user')
      .send({
        name: 'Test User',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User added');
    expect(res.body.user).toHaveProperty('name', 'Test User');
  });
});
