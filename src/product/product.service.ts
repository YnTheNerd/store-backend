// src/product/product.service.ts

// Assurez-vous d'importer le DTO
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/create-product.dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../../generated/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  // 1. Injection du Service
  constructor(private prisma: PrismaService) {} 
  
  // 2. Implémentation de la méthode create
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({
      data: {
        ...createProductDto,
      },
    });
  }

  // 3. Ajout de la méthode findAll paginée 
  async findAll(skip: number, take: number): Promise<Product[]> {
    return await this.prisma.product.findMany({ 
      skip: skip, // L'offset
      take: take, // La limite par page
    });
  }

  // 4. Implémentation de la méthode findOne
  async findOne(productId: number) {
    // Utilisation de findUniqueOrThrow pour garantir une erreur 404 si non trouvé
    return await this.prisma.product.findUniqueOrThrow({
      where: {
        productId: productId, // Recherche par l'identifiant
      },
    });
  }

  // 5. Implémentation de la méthode update
   async update(productId: number, updateProductDto: UpdateProductDto) {
    // Utilise .update() avec la clause 'where' pour l'ID et 'data' pour les changements.
    return await this.prisma.product.update({
      where: {
        productId: productId,
      },
      data: updateProductDto, // Prisma applique uniquement les champs présents dans le DTO
    });
  }


  // 6. Implémentation de la méthode remove
  async remove(productId: number): Promise<Product> {
    // Utilise .delete() avec la clause 'where' pour cibler l'ID
    return await this.prisma.product.delete({
      where: {
        productId: productId,
      },
    });
  }
}
