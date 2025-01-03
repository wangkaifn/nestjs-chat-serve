import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
// import { Role } from '@prisma/client';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  // @IsEnum(Role)
  @IsOptional()
  role?: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
