import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto } from './dto/createOrderDto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,

  ) { }

  //Placer une commande à partir d’un panier
  async placeOrder(createOrderDto: CreateOrderDto) {
    const {userId, cartId} = createOrderDto;
    // Vérifier si le panier existe et contient des produits
    const cart = await this.prisma.cart.findUnique({
      where: { cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) throw new NotFoundException('Panier introuvable');
    if (cart.items.length === 0) throw new BadRequestException('Le panier est vide');

    const totalAmount = await this.cartService.getTotal(cart.userId)
    // Créer la commande
    const order = await this.prisma.order.create({
      data: {
        userId,
        cartId,
        status: 'EN_COURS',
        totalAmount,
      },
      include: {
        user: true,
        cart: {
          include: {
            items: {
              include:
              {
                product: true
              }
            },
          },
        },
      },
    });

    return order;
  }

  // Annuler une commande
  async cancelOrder(orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { orderId } });
    if (!order) throw new NotFoundException('Commande introuvable');

    if (order.status === 'ANNULEE') {
      throw new BadRequestException('Cette commande est déjà annulée');
    }

    return this.prisma.order.update({
      where: { orderId },
      data: { status: 'ANNULEE' },
    });
  }

  // Suivre une commande
  async trackOrder(orderId: number, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: {
        cart: {
          include: {
            items: { include: { product: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Commande introuvable');

    return {
      status,
    };
  }

  //get all users
  async getOrders(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        select: {
          orderId: true,
          user: {
            select:{
              username: true,
            }
          },
          cart: {
            select:{
              items:{
                select:{
                  product:{
                    select:{
                      name: true,
                    }
                  }
                }
              }
            }
          },
          createdAt: true,
          status: true,
          totalAmount: true,
        },
        orderBy: { orderId: 'asc' }
      }),
      this.prisma.user.count()
    ]);

    return {
      data: orders,
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

}
