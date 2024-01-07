import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/model/user.model';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  const mockUserService = {
    validate: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        {
          provide: getModelToken('User'),
          useValue: mockUserService,
        },
      ],
    })
      .overrideProvider(getModelToken('User'))
      .useValue(mockUserService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/login (POST)', () => {
    const mockUserCredential = {
      username: 'alice',
      password: '123',
    };

    const mockRequestUser = {
      _id: '659564f934ad33a4db5d5f7f',
      username: 'alice',
    };

    return request(app.getHttpServer())
      .post('/login')
      .expect(200)
      .send(mockUserCredential)
      .then((res) => {
        jest
          .spyOn(userModel, 'findOne' as any)
          .mockResolvedValue(mockRequestUser);

        expect({
          accessToken: 'awdawdawdawdwad',
          expireIn: 3000,
          userId: '659564f934ad33a4db5d5f7f',
        });
      });
  });
});
