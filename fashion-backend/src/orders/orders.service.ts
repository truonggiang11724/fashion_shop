import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, ...data } = createOrderDto;

    return this.prisma.orders.create({
      data: {
        ...data,
        order_items: items ? { create: items } : undefined,
      },
      include: { order_items: true },
    });
  }

  async findAll(userId: number) {    
    return this.prisma.orders.findMany({
      where: {
        customer_id: userId
      },
      orderBy: { created_at : "desc" },
      include: { order_items: true },
    });
  }

  async findOne(orderId: number) {
    return this.prisma.orders.findUnique({
      where: { order_id: orderId },
      include: { order_items: {include: {product_variants: 
        {include:  {products: true}}
      }},  },
    });
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    const { items, ...data } = updateOrderDto;

    return this.prisma.$transaction(async (prisma) => {
      if (items) {
        await prisma.order_items.deleteMany({ where: { order_id: orderId } });
      }

      return prisma.orders.update({
        where: { order_id: orderId },
        data: {
          ...data,
          order_items: items ? { create: items } : undefined,
        },
        include: { order_items: true },
      });
    });
  }

  async remove(orderId: number) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.order_items.deleteMany({ where: { order_id: orderId } });
      await prisma.payments.deleteMany({ where: { order_id: orderId } });
      await prisma.refunds.deleteMany({ where: { order_id: orderId } });
      await prisma.shipments.deleteMany({ where: { order_id: orderId } });
      await prisma.promotion_usages.deleteMany({
        where: { order_id: orderId },
      });
      await prisma.wallet_transactions.deleteMany({
        where: { order_id: orderId },
      });
      await prisma.cancel_requests.deleteMany({ where: { order_id: orderId } });
      return prisma.orders.delete({ where: { order_id: orderId } });
    });
  }
}
