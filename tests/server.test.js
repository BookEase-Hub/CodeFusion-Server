const request = require('supertest');
const { app, serverInstance } = require('../server');
const connectDB = require('../config/db');

jest.mock('../config/db', () => jest.fn());
jest.mock('stripe', () => () => ({
  customers: {
    create: jest.fn(),
  },
  subscriptions: {
    create: jest.fn(),
  },
}));

describe('Server', () => {
  afterAll((done) => {
    serverInstance.close(done);
  });

  it('should return 200 OK', async () => {
    connectDB.mockImplementation(() => Promise.resolve());
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});
