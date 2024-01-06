import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from '../DTO/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async insertUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.insertUser(createUserDTO);
  }
}
