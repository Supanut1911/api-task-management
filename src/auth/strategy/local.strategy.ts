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
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new NotFoundException('not found username or password');
    }

    return user;
  }
}
