import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from '../src/task/model/tasks.model'; // Replace with correct path

// Mock the JwtAuthGuard behavior
jest.mock('../src/auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockImplementation(() => true),
  })),
}));

describe('TaskController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken('Task'))
      .useValue({
        find: jest.fn(() => []),
        findById: jest.fn(() => ({ _id: 'mockId' })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // it('/task (POST) - should create a new task', async () => {
  //   const createTaskDTO = {
  //     title: 'Task 1',
  //     description: 'Task 1 description',
  //   };

  //   // Assuming you have a valid JWT token for authorization in your tests
  //   const jwtToken = 'your_valid_jwt_token';

  //   const response = await request(app.getHttpServer())
  //     .post('/task')
  //     .set('Authorization', `Bearer ${jwtToken}`)
  //     .send(createTaskDTO)
  //     .expect(HttpStatus.CREATED);

  //   expect(response.body).toHaveProperty('taskId');
  // });

  it('/task (GET) - should get all tasks', async () => {
    const response = await request(app.getHttpServer()).get('/task');
    expect(response.status).toBe(HttpStatus.OK);
  });
});
