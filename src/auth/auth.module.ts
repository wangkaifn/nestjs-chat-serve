import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
