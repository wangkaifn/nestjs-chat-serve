import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginEmailCodeDto {
  @IsEmail({}, { message: '请输入有效的电子邮件地址' })
  email: string;

  @IsString({ message: '验证码必须是字符串' })
  @MinLength(6, { message: '验证码长度至少为6个字符' })
  @MaxLength(6, { message: '验证码长度最多为6个字符' })
  code: string;
}
