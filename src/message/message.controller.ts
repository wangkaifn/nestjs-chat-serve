// src/message/message.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('消息模块')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // 发送消息
  @Post('create')
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    console.log('createMessageDto', createMessageDto);

    try {
      const result = await this.messageService.createMessage(createMessageDto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 获取历史消息
  @Get('history')
  async getHistory(
    @Query('conversationId') conversationId: string,
    @Body('limit') limit: number,
  ) {
    try {
      const history = await this.messageService.getConversationHistory(
        conversationId,
        limit,
      );
      return history;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
