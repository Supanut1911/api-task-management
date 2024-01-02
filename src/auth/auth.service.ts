import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username);
    const match = comparePassword(password, user.password);
    if (user && match) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user) {
    const userRes = user._doc;

    const payload = {
      username: userRes.username,
      sub: userRes._id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
