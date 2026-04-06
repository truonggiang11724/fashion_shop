import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
}
