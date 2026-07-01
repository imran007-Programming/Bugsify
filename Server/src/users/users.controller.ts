import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/Jwtguard';
import { userUpdateDto } from './dto/user.dto';
import { Roles } from 'src/auth/decoraters/roles.decorator';
import { Bug_status, Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  getAllUsers() {
    return this.usersService.getAllusers()
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id)
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: userUpdateDto) {
    return this.usersService.updateUser(id, body)
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id)
  }

  @Patch(':id/block')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  blockUser(@Param('id') id: string) {
    return this.usersService.blockUser(id)
  }

  @Patch(':id/unblock')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  unblockUser(@Param('id') id: string) {
    return this.usersService.unblockUser(id)
  }


}
