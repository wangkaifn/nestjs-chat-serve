export class CreateConversationDto {
  title: string;
  isPinned?: boolean;
  userId: string; // 关联的用户 ID
}
