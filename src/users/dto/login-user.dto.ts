import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: '请输入有效的电子邮件地址' })
  @ValidateIf((object) => !object.username) // 如果没有提供 username，则检查 email
  email?: string;

  @IsString({ message: '用户名必须是字符串' })
  @MinLength(4, { message: '用户名长度至少为4个字符' })
  @MaxLength(20, { message: '用户名长度最多为20个字符' })
  @ValidateIf((object) => !object.email) // 如果没有提供 email，则检查 username
  username?: string;

  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度至少为6个字符' })
  @MaxLength(20, { message: '密码长度最多为20个字符' })
  password: string;
}
