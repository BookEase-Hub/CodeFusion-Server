const request = require('supertest');
const app = require('../server');
const nock = require('nock');
const User = require('../models/User');

describe('AI Integration', () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});

    const userRes = await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    token = userRes.body.token;
  });

  it('should get a response from the AI', async () => {
    const scope = nock('https://api.continue.dev')
      .post('/v1/chat/completions')
      .reply(200, {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Hello, how can I help you today?'
            }
          }
        ]
      });

    const res = await request(app)
      .post('/api/v1/ai/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Hello'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[1].content).toEqual('Hello, how can I help you today?');
    scope.done();
  });

  it('should generate code from a prompt', async () => {
    const scope = nock('https://api.continue.dev')
      .post('/v1/code/completions')
      .reply(200, {
        choices: [
          {
            text: 'console.log("Hello, World!");'
          }
        ]
      });

    const res = await request(app)
      .post('/api/v1/ai/code')
      .set('Authorization', `Bearer ${token}`)
      .send({
        prompt: 'Say "Hello, World!" in JavaScript'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.choices[0].text).toEqual('console.log("Hello, World!");');
    scope.done();
  });
});
