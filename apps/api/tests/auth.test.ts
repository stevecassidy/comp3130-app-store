import {describe, expect, test, beforeEach } from '@jest/globals';
import request from 'supertest';
import App from "../src/config/express.config";
import {createUserRecord} from '../src/controller/user/user.controller';

test('responds to / with Hello', async () => {
  return request(App)
    .get('/')
    .expect(200)
    .expect('Hello');
});

// Auth endpoint tests
describe('Auth Endpoints', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!',
    name: 'Test User',
    salt: '',
  };

  beforeEach(async () => {
    await createUserRecord(testUser);
  });

  test('POST /api/users/ - should register a new user', async () => {
    const newUser = {
      email: 'new@example.com',
      password: 'Test123!',
      name: 'New User',
    };
  
    const response = await request(App)
      .post('/api/user')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toHaveProperty('email', newUser.email);
  });


  test('POST /api/users/ - should reject registering an existing user', async () => {
    await request(App)
      .post('/api/user')
      .send(testUser)
      .expect(409);
  });


  test('POST /api/auth/login - should login successfully', async () => {
    const response = await request(App)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toHaveProperty('email', testUser.email);
  });


});
