import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './model/user.model';
import { Model } from 'mongoose';
import { CreateUserDTO } from './DTO/createUser.dto';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModule: Model<User>,
  ) {}

  async insertUser(createUserDTO: CreateUserDTO) {
    const { username, password } = createUserDTO;
    const emailLowerCase = createUserDTO.email.toLocaleLowerCase();
    try {
      const hashPassword = encodePassword(password);
      const newUser = new this.userModule({
        username,
        password: hashPassword,
        email: emailLowerCase,
      });
      const user = await newUser.save();
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findUserByEmail(email: string) {
    const emailLowerCase = email.toLocaleLowerCase();
    try {
      const user = await this.userModule.findOne({ email: emailLowerCase });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
