// src/message/message.service.ts
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import axios from 'axios';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // 创建消息并获取 GPT 响应
  async createMessage(
    createMessageDto: CreateMessageDto,
    model: string = 'gpt-3.5-turbo',
  ) {
    const { content, userId, conversationId } = createMessageDto;

    // 记录用户消息
    const userMessage = await this.prisma.message.create({
      data: {
        content,
        role: 'USER',
        conversationId,
        userId,
      },
    });

    // 获取最近的历史消息作为上下文（例如最近10条）
    const history = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 构建上下文
    const context = history.reverse().map((msg) => ({
      role: msg.role.toLowerCase(),
      content: msg.content,
    }));

    // 调用 GPT 接口生成回复
    const gptResponse = await this.callGPT({
      context,
      model,
    });

    // 记录助手消息
    const assistantMessage = await this.prisma.message.create({
      data: {
        content: gptResponse,
        role: 'ASSISTANT',
        conversationId,
      },
    });

    return { userMessage, assistantMessage };
  }

  // 调用 GPT 接口
  private async callGPT({
    context,
    model,
  }: {
    context: Array<{ role: string; content: string }>;
    model: string;
  }): Promise<string> {
    const apiKey = this.configService.get('GPT_API_KEY');
    const apiUrl = this.configService.get('GPT_API_URL');
    console.log(model);

    // const payload = {
    //   // model: 'gpt-3.5-turbo', // 根据需要选择模型
    //   model: 'gpt-4o-mini',
    //   messages: context,
    // };

    try {
      const response = await axios.post(
        apiUrl,
        {
          model,
          messages: context,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      const assistantContent = response.data.choices[0].message.content;
      return assistantContent;
    } catch (error) {
      console.error(
        'Error calling GPT API:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to get response from GPT');
    }
  }

  // 获取会话的历史消息
  async getConversationHistory(conversationId: string, limit: number = 100) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  // 删除当前会话内的消息
  async clearConversationHistory(conversationId: string) {
    return this.prisma.message.deleteMany({
      where: { conversationId },
    });
  }
}
