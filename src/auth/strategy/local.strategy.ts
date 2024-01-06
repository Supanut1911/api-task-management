import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({}); //config
  }

  async validate(username: string, password): Promise<any> {
    console.log(
      '🚀 ~ file: local.strategy.ts:17 ~ LocalStrategy ~ validate ~ username:',
      username,
      password,
    );
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new NotFoundException('not found username or password');
    }

    return user;
  }
}
