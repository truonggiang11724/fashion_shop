import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminGuard } from './admin.guard';
import { log } from 'console';
import { LoginDto } from '../auth/dto/login.dto';

@ApiTags('Admin Auth')
@Controller('admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;    

    
    return this.adminAuthService.login(email, password);
  }

  @Get('me')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get admin profile' })
  @ApiResponse({ status: 200, description: 'Admin profile' })
  async getProfile(@Request() req: any) {
    return this.adminAuthService.getProfile(req.user.user_id);
  }
}
