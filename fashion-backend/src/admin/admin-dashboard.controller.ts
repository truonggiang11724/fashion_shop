import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminGuard } from './admin.guard';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
// @UseGuards(AdminGuard)
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  async getStats() {
    return this.adminDashboardService.getStats();
  }
}
