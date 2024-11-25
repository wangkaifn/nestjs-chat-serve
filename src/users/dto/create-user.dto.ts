import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(4, { message: '用户名长度至少为4个字符' })
  @MaxLength(20, { message: '用户名长度最多为20个字符' })
  username: string;

  @IsEmail({}, { message: '请输入有效的电子邮件地址' })
  email: string;

  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度至少为6个字符' })
  @MaxLength(20, { message: '密码长度最多为20个字符' })
  password: string;

  @IsOptional()
  avatar?: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  code: string;
}
