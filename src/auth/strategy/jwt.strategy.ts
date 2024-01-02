import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { configService } from 'src/config/config.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJWTSECRET(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    //const user = await this.userService.getById(payload.sub)
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
