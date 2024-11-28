import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGptModelDto } from './create-gptmodel.dto';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGptModelDto)
  models: CreateGptModelDto[];

  @IsOptional()
  @IsString()
  desc?: string;
}
