import { Module } from '@nestjs/common';
import { GptModelService } from './gpt-model.service';
import { GptModelController } from './gpt-model.controller';

@Module({
  controllers: [GptModelController],
  providers: [GptModelService],
})
export class GptModelModule {}
