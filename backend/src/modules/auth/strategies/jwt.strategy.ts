// backend/src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shopkeeper } from '../../database/entities/shopkeeper.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(Shopkeeper)
    private shopkeeperRepository: Repository<Shopkeeper>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const shopkeeper = await this.shopkeeperRepository.findOne({ where: { id: payload.sub } });
    if (!shopkeeper) {
      throw new UnauthorizedException();
    }
    return { shopkeeperId: shopkeeper.id, email: shopkeeper.email, shopName: shopkeeper.shopName };
  }
}