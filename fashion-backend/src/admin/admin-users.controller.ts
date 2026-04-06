import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { AdminGuard } from './admin.guard';

class UpdateUserStatusDto {
  status!: string;
}

@ApiTags('Admin Users')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users for admin' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.adminUsersService.findAll({ page, limit });
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'User status updated' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminUsersService.updateStatus(id, updateUserStatusDto.status);
  }
}
