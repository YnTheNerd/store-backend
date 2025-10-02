import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteDto } from './dto/deleteDto';

@Injectable()
export class UsersService {

    constructor(
        private readonly prismaService: PrismaService
    ) { }
    async getUsers() {
        return this.prismaService.user.findMany({
          select: {
            userId: true,
            username: true,
            email: true,
            address: true,
            isActive: true,
            role: true,
            carts: {
              select: {
                cartId: true,
                createdAt: true,
                updatedAt: true,
                items: {
                  select: {
                    cartItemId: true,
                    quantity: true,
                    product: {
                      select: {
                        productId: true,
                        name: true,
                        price: true,
                        image: true
                      }
                    }
                  }
                }
              }
            },
            orders: {
              select: {
                orderId: true,
                createdAt: true,
                status: true,
                totalAmount: true,
                payment: {
                  select: {
                    paymentId: true,
                    paymentDate: true,
                    paymentOption: true,
                    amount: true
                  }
                }
              }
            }
          },
          orderBy: {
            userId: 'asc'
          }
        });
      }      

    async deleteUsers(deleteDto: DeleteDto) {
        const {email} = deleteDto;
        await this.prismaService.user.update({
            where: { email },
            data: {
              isActive: false,
            },
          });
    }

}
