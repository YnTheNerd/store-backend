import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductDto } from './dto/cartDto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) { }

  //  Ajouter un produit au panier
  async addProduct(addProductDto: AddProductDto) {
    const { userId, productId, quantity } = addProductDto;

    // Vérifier si le produit existe
    const product = await this.prisma.product.findUnique({ where: { productId } });
    if (!product) throw new NotFoundException('Produit introuvable');

    // Vérifier que le stock est suffisant
    if (product.stock < quantity) {
      throw new BadRequestException('Stock insuffisant pour ce produit');
    }

    // Vérifier si le user a déjà un panier
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { product: true }, // inclure les produits des items
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    }

    // Vérifier si l’article est déjà dans le panier
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.cartId,
        productId,
      },
    });

    if (existingItem) {
      // Mise à jour de la quantité
      await this.prisma.cartItem.update({
        where: { cartItemId: existingItem.cartItemId },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Création d’un nouvel item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.cartId,
          productId,
          quantity,
        },
      });
    }

    // ⚡ Retourner le panier avec toutes les infos
    return this.prisma.cart.findUnique({
      where: { cartId: cart.cartId },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                productId: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }


  // Supprimer un produit spécifique du panier
  async removeItem(cartItemId: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { cartItemId },
    });

    if (!item) throw new NotFoundException('Article introuvable dans le panier');

    return this.prisma.cartItem.delete({
      where: { cartItemId },
    });
  }

  //Vider complètement le panier d’un utilisateur
  async destructCart(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) throw new NotFoundException('Panier introuvable');

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.cartId },
    });

    return { message: 'Panier vidé avec succès' };
  }

  // Calculer le total du panier
  async getTotal(userId: number): Promise<number> {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) throw new NotFoundException('Panier introuvable');

    const total = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    return total ;
  }


  async getCartById(userId: number) {
    const cart = await this.prisma.cart.findFirst({
        where: { userId },
        select: {
            cartId: true,
            user: {
              select: {
                userId: true,
                username: true,
                email: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    productId: true,
                    name: true,
                    price: true,
                    image: true,
                  },
                },
              },
            },
        }
    });

    if (!cart) {
        throw new NotFoundException(`Panier avec l'ID introuvable`);
    }

    return cart;
}
}
