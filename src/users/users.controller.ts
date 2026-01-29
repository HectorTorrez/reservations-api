import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current/:id')
  currentUser(@Param('id') id: number) {
    console.log(id);
    return this.usersService.currentUser(Number(id));
  }
}
