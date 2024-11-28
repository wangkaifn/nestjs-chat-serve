import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { PrismaModule } from 'nestjs-prisma';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionsFilter } from './common/http-exceptions.filter';
import { ResponseInterceptor } from './common/response.interceptor';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EmailModule } from './email/email.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { GptModelModule } from './gpt-model/gpt-model.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    //jwt模块
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        // 读取配置中的secret
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    EmailModule,
    ConversationModule,
    MessageModule,
    GptModelModule,
  ],
  controllers: [],
  providers: [
    // 应用过滤器
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    // 应用拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
