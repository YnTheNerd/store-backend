// src/product/product.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/create-product.dto/update-product.dto';

// Import du type Product depuis le client Prisma généré dans le dossier personnalisé
import { Product } from '../../generated/prisma';

@Controller('product') // La route de base est /product
export class ProductController {
  // 1. Injection du Service
  constructor(private readonly productService: ProductService) {}

  @Post() // Gère la requête POST /product
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    // 2. Le DTO est automatiquement validé ici par le ValidationPipe global
    // 3. On appelle la méthode du service et on retourne le résultat
    return this.productService.create(createProductDto);
  }

  @Get() // Gère la requête GET /product?skip=0&take=10
  async findAll(
    // 1. Récupère le paramètre 'skip' de l'URL.
    // 2. NestJS le convertit automatiquement en nombre (grâce au transform: true du ValidationPipe).
    @Query('skip') skip: number = 0, // Valeur par défaut de 0 si absent
    @Query('take') take: number = 28, // Valeur par défaut de 10 si absent
  ): Promise<Product[]> {
    // Appelle le service avec les paramètres paginés
    return this.productService.findAll(skip, take);
  }

  @Get(':id') // 1. Définit la route GET /product/ID (ex: /product/12)
  async findOne(@Param('id') id: string): Promise<Product> {
    // 2. Récupère la valeur après /product/ dans la variable 'id'

    // Convertit la chaîne 'id' en nombre (car notre DB utilise des Int)
    const productId = parseInt(id, 10);

    // 3. Appelle la méthode du service
    return this.productService.findOne(productId);
  }

  @Patch(':id') // Utilise PATCH pour la mise à jour partielle sur la route /product/ID
  async update(
    @Param('id') id: string, // Récupère l'ID du chemin de l'URL
    @Body() updateProductDto: UpdateProductDto, // Récupère le corps de la requête
  ): Promise<Product> {
    const productId = parseInt(id, 10); // Convertit l'ID de string à number

    // Appelle la méthode du service
    return this.productService.update(productId, updateProductDto);
  }

  @Delete(':id') // 1. Définit la route DELETE /product/ID
  async remove(@Param('id') id: string): Promise<Product> {
    const productId = parseInt(id, 10); // Convertit l'ID en nombre

    // 2. Appelle la méthode du service pour supprimer
    return this.productService.remove(productId);
  }
}
