import { describe, test, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import App from "../src/config/express.config";
import { createUserRecord } from '../src/controller/user/user.controller';
import { ASSET_DIR } from '../src/config/express.config';
import { rmSync } from 'fs';

describe('AndroidApp Endpoints', () => {
  let authToken: string;
  let createdAppId: string;
  
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!',
    name: 'Test User',
  };

  const testApp = {
    name: 'Test App',
    description: 'Test Description',
    owner: testUser.email
  };

  beforeEach(async () => {
    await createUserRecord(testUser);

    // Get auth token
    const loginResponse = await request(App)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    authToken = loginResponse.body.data.token;

    // Create a test app for subsequent tests
    const createResponse = await request(App)
        .post('/api/app/')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testApp);
    createdAppId = createResponse.body.data.id;
  });

  afterAll(async () => {
    // delete any created assets in ASSET_DIR
    rmSync(ASSET_DIR, { recursive: true });
  });

  test('GET /api/app/:id - get app by id', async () => {
    await request(App)
      .get(`/api/app/${createdAppId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.name).toBe(testApp.name);
      });
  });

  test('GET /api/app/:searchType/:searchKey/:pageNumber - get apps with auth', async () => {
    await request(App)
      .get(`/api/app/_/1`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).toBe(1);
      });
  });

  test('GET /api/app/:searchType/:searchKey/:pageNumber - get apps with search term', async () => {
    await request(App)
      .get(`/api/app/Test/1`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).toBe(1);
      });
  });

  test('GET /api/app/:searchType/:searchKey/:pageNumber - get apps with search term not matching', async () => {
    await request(App)
      .get(`/api/app/Egg/1`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).toBe(0);
      });
  });


  test('POST /api/app/ - create app with auth', async () => {

    const newApp = {
      name: 'New Test App',
      description: 'Test Description',
      owner: testUser.email
    };

    await request(App)
      .post('/api/app/')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newApp)
      .expect(201);
  });

  test('PUT /api/app/:id - update app with auth', async () => {
    const updatedApp = {
      ...testApp,
      description: 'Updated Description'
    };

    await request(App)
      .put(`/api/app/${createdAppId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedApp)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.description).toBe('Updated Description');
      });
  });

  test('DELETE /api/app/:id - delete app with auth', async () => {
    await request(App)
      .delete(`/api/app/${createdAppId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  // Unauthorized access tests
  test('GET /api/app/:searchKey/:pageNumber - unauthorized', async () => {
    await request(App)
      .get('/api/app/test/1')
      .expect(401);
  });

  test('PUT /api/app/:id - unauthorized', async () => {
    await request(App)
      .put(`/api/app/${createdAppId}`)
      .send(testApp)
      .expect(401);
  });

  test('DELETE /api/app/:studentId - unauthorized', async () => {
    await request(App)
      .delete(`/api/app/${createdAppId}`)
      .expect(401);
  });

  // uploading APK files

  test('POST /api/app/:id/apk - upload APK with auth', async () => {
      const apkFilePath = 'tests/fixtures/test.apk';
      const response = await request(App)
        .post(`/api/app/${createdAppId}/apk`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('apk', apkFilePath);

      expect(response.status).toBe(201);
      expect(response.body.data.url).toBeDefined();
      
      // get the app and check that the image is listed
      const appResponse = await request(App)
      .get(`/api/app/${createdAppId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

      expect(appResponse.body.data.apkFiles.length).toBe(1);
      expect(appResponse.body.data.apkFiles[0].url).toBe(response.body.data.url);



      // now get the APK file back
      const apkResponse = await request(App)
        .get(response.body.data.url)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(apkResponse.body).toBeDefined();
    });


    test('POST /api/app/:id/image - upload image with auth', async () => {
      const imageFilePath = 'tests/fixtures/screenshot.png';
      const response = await request(App)
        .post(`/api/app/${createdAppId}/image`)
        .field('role', 'icon')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', imageFilePath);

      expect(response.status).toBe(201);
      expect(response.body.data.url).toBeDefined();
      
      console.log('image URL', response.body.data.url);
      
      // get the app and check that the image is listed
      const appResponse = await request(App)
        .get(`/api/app/${createdAppId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(appResponse.body.data.images.length).toBe(1);
      expect(appResponse.body.data.images[0].url).toBe(response.body.data.url);

      // now get the image file back
      const apkResponse = await request(App)
        .get(response.body.data.url)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(apkResponse.body).toBeDefined();
    });



});


