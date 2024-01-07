import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './model/user.model';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userModel: Model<User>;

  const mockUserModelService = {
    findUserByUsername: jest.fn(),
    findOne: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  jest.mock('./bcrypt', () => ({
    comparePassword: jest.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModelService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('validateUser should return a user', async () => {
    const mockUser = {
      _id: '6599261c21d0c21db87179bf',
      username: 'alice',
      password: 'hashpassword',
      tasks: [],
      __v: 0,
    };

    const mockResponse = {
      _id: '6599261c21d0c21db87179bf',
      username: 'alice',
      tasks: [],
      __v: 0,
    };

    const mockUserName = 'alice';

    jest.spyOn(userModel, 'findOne' as any).mockResolvedValue(mockUser);

    await userService.findUserByUsername(mockUserName);

    jest
      .spyOn(mockUserModelService, 'findUserByUsername')
      .mockResolvedValueOnce(mockResponse);

    jest.spyOn(bcrypt, 'compareSync').mockResolvedValueOnce(true);

    const result = await authService.validateUser('alice', '123');
    expect(result).toEqual(mockResponse);
  });

  // it('validateUser should reutrn null', async () => {
  //   const mockResponse = {
  //     _id: '6599261c21d0c21db87179bf',
  //     username: 'alice',
  //     tasks: [],
  //     __v: 0,
  //   };

  //   jest
  //     .spyOn(mockUserModelService, 'findUserByUsername')
  //     .mockResolvedValue(null);

  //   jest.spyOn(bcrypt, 'compareSync').mockResolvedValue(false);

  //   // (comparePassword as jest.Mock).mockResolvedValueOnce(false);

  //   const result = await authService.validateUser('alice', '123');
  //   expect(result).toEqual(null);
  // });

  it('login should return a token', async () => {
    const mockUser = {
      _doc: {
        _id: '6599261c21d0c21db87179bf',
        username: 'alice',
        password: 'hashpassword',
        tasks: [],
        __v: 0,
      },
    };

    const mockResponse = {
      accessToken: 'mockToken',
      expireIn: 3000,
      userId: '6599261c21d0c21db87179bf',
    };

    jwtService.sign = jest.fn().mockReturnValue('mockToken');

    const result = await authService.login(mockUser);
    expect(result).toEqual(mockResponse);
  });
});
