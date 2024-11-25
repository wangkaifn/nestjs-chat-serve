// src/conversation/conversation.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('会话模块')
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Get(':userId')
  async findAllByUser(@Param('userId') userId: string) {
    return await this.conversationService.findAllByUser(userId);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return await this.conversationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<CreateConversationDto>,
  ) {
    return this.conversationService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }
}
