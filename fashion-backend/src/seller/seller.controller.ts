import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SellerService } from './seller.service';

@ApiTags('Seller')
@Controller('seller')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get seller dashboard stats' })
  @ApiResponse({ status: 200, description: 'Dashboard stats' })
  async getDashboard(@Request() req) {
    return this.sellerService.getDashboardStats(req.user.user_id);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get products by seller' })
  @ApiResponse({ status: 200, description: 'List of seller products' })
  async getProducts(@Request() req) {
    return this.sellerService.getSellerProducts(req.user.user_id);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get orders for seller products' })
  @ApiResponse({ status: 200, description: 'List of orders containing seller products' })
  async getOrders(@Request() req) {
    return this.sellerService.getSellerOrders(req.user.user_id);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Get reviews for seller products' })
  @ApiResponse({ status: 200, description: 'List of reviews for seller products' })
  async getReviews(@Request() req) {
    return this.sellerService.getSellerReviews(req.user.user_id);
  }

  @Get('wallet')
  @ApiOperation({ summary: 'Get seller wallet info' })
  @ApiResponse({ status: 200, description: 'Seller wallet information' })
  async getWallet(@Request() req) {
    return this.sellerService.getSellerWallet(req.user.user_id);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get seller analytics' })
  @ApiResponse({ status: 200, description: 'Seller analytics data' })
  async getAnalytics(@Request() req) {
    return this.sellerService.getSellerAnalytics(req.user.user_id);
  }
}
