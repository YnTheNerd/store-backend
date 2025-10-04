import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../../generated/prisma';
import { FinalProductData } from './dto/create-product.dto/FinalProductData.dto';
import { UpdateProductDto } from './dto/create-product.dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Accepte FinalProductData qui contient l'URL de l'image
  async create(finalProductData: FinalProductData): Promise<Product> {
    return await this.prisma.product.create({
      data: finalProductData, // Contient maintenant l'image URL
    });
  }

  async findAll(skip: number, take: number): Promise<Product[]> {
    return await this.prisma.product.findMany({
      skip: skip,
      take: take,
    });
  }

  async findOne(productId: number) {
    return await this.prisma.product.findUniqueOrThrow({
      where: {
        productId: productId,
      },
    });
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: {
        productId: productId,
      },
      data: updateProductDto,
    });
  }

  async remove(productId: number): Promise<Product> {
    return await this.prisma.product.delete({
      where: {
        productId: productId,
      },
    });
  }

}
