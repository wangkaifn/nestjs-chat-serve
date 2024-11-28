import { Controller, Get } from '@nestjs/common';
import { GptModelService } from './gpt-model.service';

@Controller('gptModel')
export class GptModelController {
  constructor(private readonly gptModelService: GptModelService) {}

  /**
   * 获取所有GPT模型
   */
  @Get('list')
  async getAllGptModels(): Promise<any> {
    return this.gptModelService.getAllModels();
  }
  /**
   * 获取所有公司 和模型信息
   */
  @Get('companyList')
  async getAllCompaniesAndModels(): Promise<any> {
    return this.gptModelService.getAllCompaniesAndModels();
  }
}
