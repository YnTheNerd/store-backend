import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteDto } from './dto/deleteDto';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }
    async getUsers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.prismaService.user.findMany({
                skip,
                take: limit,
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
                orderBy: { userId: 'asc' }
            }),
            this.prismaService.user.count()
        ]);

        return {
            data: users,
            meta: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async deleteUsers(deleteDto: DeleteDto) {
        const { email } = deleteDto
        await this.prismaService.user.update({
            where: { email },
            data: {
                isActive: false,
            },
        });
    }

    async getUserById(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: { userId },
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
            }
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur avec l'ID ${userId} introuvable`);
        }

        return user;
    }



}
