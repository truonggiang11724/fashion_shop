import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add an item cart' })
  @ApiResponse({ status: 201, description: 'Add item successfully' })
  create(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.addToCart(updateCartDto);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all carts' })
  // @ApiResponse({ status: 200, description: 'List of carts' })
  // findAll() {
  //   return this.cartService.findAll();
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by user ID' })
  @ApiResponse({ status: 200, description: 'Cart details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findByCustomerId(id);
  }

  // @Put(':id')
  // @ApiOperation({ summary: 'Update a cart and its items' })
  // @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateCartDto: UpdateCartDto,
  // ) {
  //   return this.cartService.update(id, updateCartDto);
  // }

  @Put('item/:id')
  @ApiOperation({ summary: 'Update quantity for a cart item' })
  @ApiResponse({ status: 200, description: 'Cart item quantity updated successfully' })
  updateCartItem(@Body() updateCartItemDto: UpdateCartItemDto) {    
    return this.cartService.updateQuantity(updateCartItemDto);
  }

  @Delete('item/:id')
  @ApiOperation({ summary: 'Remove a cart item' })
  @ApiResponse({ status: 200, description: 'Cart item removed successfully' })
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(id);
  }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a cart' })
  // @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.cartService.remove(id);
  // }
}
