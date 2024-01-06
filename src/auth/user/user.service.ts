import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../model/user.model';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../DTO/createUser.dto';
import { encodePassword } from '../bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModule: Model<User>,
  ) {}

  async insertUser(createUserDTO: CreateUserDTO) {
    const { username, password } = createUserDTO;
    try {
      const hashPassword = encodePassword(password);
      const newUser = {
        username,
        password: hashPassword,
      };
      const createdUser = await this.userModule.create(newUser);
      return createdUser;
    } catch (error) {
      throw new BadRequestException(`This username is already taken`);
    }
  }

  async findUserByUsername(username: string) {
    try {
      const user = await this.userModule.findOne({
        username,
      });
      if (!user) {
        throw new BadRequestException('Please check your credentials');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
