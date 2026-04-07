import {
  Body,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { changePasswordDto } from './dto/changePassword.dto';


@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user info' })
  @ApiResponse({
    status: 200,
    description: 'Returns the currently authenticated user',
  })
  async getCurrentUser(@Request() req) {
    const user = await this.userService.findById(req.user.user_id);
    return user;
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.userService.update(req.user.user_id, updateUserDto);
  }

  @Put('changePassword')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password hash' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  async changePassword(
    @Body() changePasswordDto: changePasswordDto,
    @Request() req,
  ) {
    return this.userService.changePassword(req.user.user_id, changePasswordDto.oldPassword, changePasswordDto.newPassword);
  }
}
