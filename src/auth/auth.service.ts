import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string) {
    return await this.usersService.findOneByUsername(username);
  }
  async validateUserById(payload: { id: string }) {
    return await this.usersService.findOneById(payload.id);
  }
  async verifyToken(token: string) {
    return this.usersService.verifyToken(token);
  }
}
