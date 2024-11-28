import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
@Injectable()
export class GptModelService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  /**
   * 获取所有模型信息
   * @returns  所有模型信息
   */
  async getAllModels() {
    return this.prisma.gPTModel.findMany();
  }

  /**
   *  获取所有公司及模型信息
   * @returns 所有公司和模型信息
   */
  async getAllCompaniesAndModels() {
    return this.prisma.gPTCompany.findMany({
      include: {
        models: true,
      },
    });
  }
}

/**
 * 默认创建模型
  async createCompanyWithModels() {
    const companies = [
      {
        name: 'OpenAI',
        models: [
          'gpt-3.5-turbo',
          'gpt-4',
          'gpt-4-turbo',
          'gpt-4-plus',
          'gpt-4o',
          'gpt-4o-mini',
          'o1-mini-2024-09-12',
          'chatgpt-4o-latest',
        ],
      },
      {
        name: 'Anthropic',
        models: [
          'claude-3-opus-20240229',
          'claude-3-sonnet-20240229',
          'claude-3-haiku-20240307',
        ],
      },
      {
        name: 'Gemini',
        models: [
          'gemini-1.5-pro',
          'gemini-1.5-pro-002',
          'gemini-1.5-flash-002',
          'gemini-1.5-pro-exp-0801',
        ],
      },
      {
        name: 'Qwen',
        models: [
          'qwen-turbo',
          'qwen-plus',
          'qwen-max',
          'qwen-max-latest',
          'qwen-long',
          'qwen-math-plus',
          'qwen2-72b-instruct',
          'qwen-turbo-latest',
          'qwen-turbo-2024-11-01',
        ],
      },
      {
        name: 'LLaMA',
        models: ['llama3-70b-8192'],
      },
    ];

    for (const company of companies) {
      const { name, models } = company;

      const createdCompany = await this.prisma.gPTCompany.create({
        data: {
          name,
          models: {
            create: models.map((modelName) => ({
              name: modelName,
            })),
          },
        },
      });
    }
  }
 */
