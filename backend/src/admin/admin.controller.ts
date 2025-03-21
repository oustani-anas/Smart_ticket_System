
import { Controller, Get, Param, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { UserService } from '../user/user.service';

@Controller('/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly userService: UserService) {}

  // Get all users
  @Get('/users')
  async getAllUsers() {
    return this.userService.findAll();
  }

  // Get user by ID
  @Get('/users/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  // Update user role
  @Put('/users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.userService.updateRole(id, role);
  }

  // Delete user
  @Delete('/users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  // Ban/Unban user
  @Put('/users/:id/ban')
  async banUser(@Param('id') id: string, @Body('isBanned') isBanned: boolean) {
    return this.userService.updateBanStatus(id, isBanned);
  }
}