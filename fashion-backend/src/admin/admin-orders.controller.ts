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
import { AdminOrdersService } from './admin-orders.service';
import { AdminGuard } from './admin.guard';

class UpdateOrderStatusDto {
  status!: string;
}

@ApiTags('Admin Orders')
@Controller('admin/orders')
@UseGuards(AdminGuard)
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders for admin' })
  @ApiResponse({ status: 200, description: 'List of orders' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.adminOrdersService.findAll({ page, limit, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details for admin' })
  @ApiResponse({ status: 200, description: 'Order details' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminOrdersService.findOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.adminOrdersService.updateStatus(
      id,
      updateOrderStatusDto.status,
    );
  }
}
