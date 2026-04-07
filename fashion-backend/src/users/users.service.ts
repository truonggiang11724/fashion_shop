import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email: email },
    });
  }

  async findById(userId: number) {
    return this.prisma.users.findUnique({
      where: { user_id: userId },
    });
  }

  async create(username: string, email: string, password_hash: string) {
    return this.prisma.users.create({
      data: {
        username,
        email,
        password_hash,
        role: 'CUSTOMER',
        status: 'active',
      },
    });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const { phone, username } = updateUserDto;

    // Update user
    return this.prisma.users.update({
      where: { user_id: userId },
      data: {
        username: username,
        phone: phone,
      }
    })

  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    if (oldPassword == newPassword) return { message: 'Mật khẩu mới phải khác mật khẩu cũ' };
    const user = await this.findById(userId);
    const isPasswordValid = await bcrypt.compare(oldPassword, user?.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu cũ không đúng');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.users.update({
      where: { user_id: userId},
      data: { password_hash: hashedPassword }
    })
  }
}
