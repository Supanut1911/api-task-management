import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../model/user.model';

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;

  const mockUserService = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get(getModelToken('User'));
  });

  it('should create a user', async () => {
    const createUserDTO = {
      username: 'alice',
      password: '123',
    };
    const mockUser = {
      _id: '659573b4e7b14ea58c7d35e7',
      username: 'alice',
      password: 'hashpassword',
      tasks: [],
    };

    jest
      .spyOn(userModel, 'create' as any)
      .mockImplementationOnce(() => Promise.resolve(mockUser));

    const result = await userService.insertUser(createUserDTO);
    expect(userModel.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw BadRequestException when create user failed', async () => {
    const createUserDTO = {
      username: 'alice',
      password: '123',
    };

    jest.spyOn(userModel, 'create' as any).mockRejectedValueOnce('error');
    await expect(userService.insertUser(createUserDTO)).rejects.toThrow(
      'This username is already taken',
    );
  });

  it('should findUserByUSernaem', async () => {
    const mockUser = {
      _id: '123456',
      username: 'alice',
      password: 'hashpassword',
      tasks: [],
    };

    jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
    const result = await userService.findUserByUsername('alice');
    expect(userModel.findOne).toHaveBeenCalledWith({ username: 'alice' });
    expect(userModel.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException when user not found', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
    await expect(userService.findUserByUsername('alice')).rejects.toThrow(
      'Please check your credentials',
    );
  });
});
