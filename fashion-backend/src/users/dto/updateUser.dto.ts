import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, isPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'username' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username!: string;

  @ApiProperty({
    example: '0912345678',
    description: 'User phone number',
  })
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  phone!: string;
}
