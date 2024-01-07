import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDTO } from '../DTO/createUser.dto';
import { Model } from 'mongoose';
import { User } from '../model/user.model';
import { getModelToken } from '@nestjs/mongoose';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userModel: Model<User>;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userModel = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('insertUser', () => {
    it('should call userService.insertUser and return the result', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'alice',
        password: '123',
      };

      const mockUser = {
        _id: '659573b4e7b14ea58c7d35e7',
        username: 'alice',
        password: 'hashpassword',
        tasks: [],
      };

      jest.spyOn(userModel, 'create' as any).mockResolvedValue(mockUser);

      const result = await userController.insertUser(createUserDTO);
      expect(userModel.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });
  });
});
