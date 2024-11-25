/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

import { omit } from 'lodash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(ConfigService)
  private configService: ConfigService;
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 获取所有用户
   */
  users() {
    return this.prismaService.user.findMany();
  }
  /**
   * 根据用户名查找用户
   */
  async findOneByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: { username },
    });
  }

  /**
   * 根据邮箱查找用户
   */
  async findOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  /**
   * 根据ID查找用户信息
   */
  async findOneById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginUserDto.username,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restUser } = user;

    const access_token = this.generateToken({
      id: user.id,
      username: user.username,
    });

    const refresh_token = this.generateToken(
      {
        id: user.id,
      },
      '7d',
    );
    return {
      userInfo: restUser,
      access_token,
      refresh_token,
      message: '登陆成功，欢迎回来',
    };
  }
  async register(registerInfo: CreateUserDto) {
    const { code, password, ...restInfo } = registerInfo;
    console.log(registerInfo, 'registerInfo');

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: registerInfo.email },
          { username: registerInfo.username },
        ],
      },
    });

    if (user) {
      throw new HttpException(
        '用户名或注册邮箱已存在',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const captcha = await this.redisService.get(
      `register_captcha_${registerInfo.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.EXPECTATION_FAILED);
    }

    if (code !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.EXPECTATION_FAILED);
    }
    // 删除验证码
    await this.redisService.del(`register_captcha_${registerInfo.email}`);
    const hashedPassword = await this.hashPassword(registerInfo.password);
    const newUser = await this.prismaService.user.create({
      data: {
        ...restInfo,
        password: hashedPassword,
      },
    });

    return omit(newUser, ['password']);
  }

  /**
   * 刷新token
   * @param refreshToken 刷新token
   * @returns access_token 和 refresh_token
   */
  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.verifyToken(refreshToken);
      const user = await this.prismaService.user.findUnique({
        where: {
          id: decoded?.id,
        },
      });

      if (!decoded) {
        throw new HttpException('无效的刷新 token', HttpStatus.UNAUTHORIZED);
      }

      const access_token = this.generateToken(
        {
          id: user.id,
          username: user.username,
        },
        this.configService.get('JWT_EXPIRES_IN'),
      );

      const new_refresh_token = this.generateToken(
        {
          id: user.id,
        },
        this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      );

      const { password, ...restUser } = user;

      return {
        userInfo: restUser,
        access_token,
        refresh_token: new_refresh_token,
        message: '刷新 token 成功',
      };
    } catch (error) {
      throw new HttpException('无效的刷新 token', HttpStatus.UNAUTHORIZED);
    }
  }

  async getCurrentUser(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
  /**
   * 加密密码
   */
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  /**
   * 验证密码
   */
  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  generateToken(
    payload: Record<string, any>,
    expiresIn: string | number = '30m',
  ): string {
    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }

  verifyToken(token: string) {
    if (!token) return null;
    const id = this.jwtService.verify(token.replace('Bearer ', ''));
    return id;
  }
}
