// src/conversation/conversation.service.ts

import { Injectable } from '@nestjs/common';

import { CreateConversationDto } from './dto/create-conversation.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    return this.prismaService.conversation.create({
      data: {
        title: createConversationDto.title,
        isPinned: createConversationDto.isPinned || false,
        user: {
          connect: { id: createConversationDto.userId },
        },
      },
    });
  }

  // 其他 CRUD 操作示例
  async findAllByUser(userId: string) {
    return await this.prismaService.conversation.findMany({
      where: { userId },
      include: { messages: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prismaService.conversation.findUnique({
      where: { id },
      include: { messages: true },
    });
  }

  async update(id: string, data: Partial<CreateConversationDto>) {
    try {
      const newConversation = await this.prismaService.conversation.update({
        where: { id },
        data,
      });
      return {
        message: '当前会话更新成功',
        ...newConversation,
      };
    } catch (error) {
      return {
        message: '当前会话更新失败' + error,
      };
    }
  }

  async remove(id: string) {
    try {
      const conversation = await this.prismaService.conversation.delete({
        where: { id },
      });
      return {
        ...conversation,
      };
    } catch (error) {
      return {
        message: '当前会话删除失败' + error,
      };
    }
  }
}
