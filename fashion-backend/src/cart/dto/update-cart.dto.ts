import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { UpdateCartItemDto } from './update-cart-item.dto';

export class UpdateCartDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Customer ID who owns the cart',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  customer_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'variant id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  variant_id?: number;
}
