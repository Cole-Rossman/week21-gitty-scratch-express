const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const agent = request.agent(app);

jest.mock('../lib/services/github.js');
// it will read the file in services and implements the mock functions in mock folder

describe('github routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  }); 

  it('/api/v1/posts signs user in and returns a list of posts', async () => {
    const res = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    const nextRes = await agent.get('/api/v1/posts');
    // expect(nextRes.status).toEqual(200);
    expect(nextRes.body).toEqual([
      {
        id: '1',
        description: 'I like the sun',
      },
      {
        id: '2',
        description: 'This assignment was hard',
      },
      {
        id: '3',
        description: 'I am excited for the weekend',
      },
      {
        id: '4',
        description: 'Toblerones are good',
      },
    ]);
  });
  
  it('/api/v1/posts should create a new post if signed in', async () => {
    const res = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });

    const nextRes = await agent.post('/api/v1/posts').send({
      description: 'I like ice cream', 
    });
    expect(nextRes.status).toEqual(200);
    expect(nextRes.body.description).toEqual('I like ice cream');
    expect(nextRes.body.id).not.toBeUndefined();
  });


});
