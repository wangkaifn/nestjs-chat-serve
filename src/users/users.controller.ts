import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Inject,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/permission.decorator';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';

export class CccDto {
  aaa: string;
  bbb: number;
  ccc: Array<string>;
}
@ApiTags('用户模块')
@Controller('users')
export class UsersController {
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.users();
  }

  @Public()
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功响应',
    type: OmitType(CreateUserDto, ['password']),
    example: {
      data: {
        id: 'cm3ud606g0000srjht1f4iqr0',
        email: '601987036@qq.com',
        username: 'akaiwoshi',
        nickname: null,
        avatar: null,
        createdAt: '2024-11-23T16:07:37.576Z',
        updatedAt: '2024-11-23T16:07:37.576Z',
      },
      code: 201,
      success: true,
      message: '',
    },
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @Post('registry')
  registry(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  /**
   * 登陆
   * @param loginUserDto
   * @returns
   */
  @Public()
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({
    example: {
      data: {
        userInfo: {
          id: 'cm3ud606g0000srjht1f4iqr0',
          email: '601987036@qq.com',
          username: 'akaiwoshi',
          nickname: null,
          avatar: null,
          createdAt: '2024-11-23T16:07:37.576Z',
          updatedAt: '2024-11-23T16:07:37.576Z',
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtM3VkNjA2ZzAwMDBzcmpodDFmNGlxcjAiLCJ1c2VybmFtZSI6ImFrYWl3b3NoaSIsImlhdCI6MTczMjM4MDU2NywiZXhwIjoxNzMyMzgyMzY3fQ.2Ie3z6-zgdmnHUQtJGQJWNDIgXAY1z_W4XP38FwdS_Q',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtM3VkNjA2ZzAwMDBzcmpodDFmNGlxcjAiLCJpYXQiOjE3MzIzODA1NjcsImV4cCI6MTczMjk4NTM2N30.JB13wUbePshVZQhdjt5F8rE_l8Ndf8qZeMy_H8NtDfM',
      },
      code: 201,
      success: true,
      message: '登陆成功，欢迎回来',
    },
  })
  @ApiBody({
    type: LoginUserDto,
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Public()
  @ApiOperation({ summary: '刷新token' })
  @ApiResponse({
    example: {
      data: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtM3VkNjA2ZzAwMDBzcmpodDFmNGlxcjAiLCJ1c2VybmFtZSI6ImFrYWl3b3NoaSIsImlhdCI6MTczM',
      },
    },
  })
  @ApiBody({
    type: class refresh_token {
      refresh_token: string;
    },
  })
  @Post('refresh-tokens')
  async refreshTokens(@Body() body: { refresh_token: string }) {
    return this.usersService.refreshTokens(body.refresh_token);
  }

  @Public()
  @ApiOperation({ summary: '注册验证码' })
  @ApiResponse({
    example: {
      message: '验证码已发送，请登陆邮箱查收',
    },
  })
  @ApiBody({
    type: class register_captcha {
      address: string;
    },
  })
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    console.log(address);

    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`register_captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return {
      message: `验证码已发送，请登陆${address}邮箱查收`,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({
    type: class currentUser {
      id: string;
      username: string;
      email: string;
      nickname: string;
      avatar: string;
      createdAt: Date;
      updatedAt: Date;
    },
  })
  @Get('currentUser')
  async getCurrentUser(@Query('id') id: string) {
    const currentUser = await this.usersService.findOneById(id);
    if (currentUser) {
      return true;
    } else {
      return false;
    }
  }
}
