import { IsOptional, IsString } from 'class-validator';

export class CreateGptModelDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  desc?: string;
}
