const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Project = require('../models/Project');

describe('Projects', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});

    const userRes = await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    token = userRes.body.token;
    const user = await User.findOne({ email: 'test@example.com' });
    userId = user.id;
  });

  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'This is a test project',
        language: 'javascript'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Test Project');
  });

  it('should get all projects for a user', async () => {
    await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'This is a test project',
        language: 'javascript'
      });

    const res = await request(app)
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it('should update a project', async () => {
    const projectRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'This is a test project',
        language: 'javascript'
      });
    const projectId = projectRes.body._id;

    const res = await request(app)
      .put(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Project',
        description: 'This is an updated project'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Project');
  });

  it('should delete a project', async () => {
    const projectRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'This is a test project',
        language: 'javascript'
      });
    const projectId = projectRes.body._id;

    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Project removed');
  });
});
