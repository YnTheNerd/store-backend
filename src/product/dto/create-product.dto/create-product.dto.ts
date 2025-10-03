// src/product/dto/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  // Nom (String, Obligatoire)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  // Prix (Nombre, Obligatoire, Positif)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  // Stock (Entier, Obligatoire)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  stock: number;

  // Clé étrangère vers la Catégorie (Entier, Obligatoire)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;
}
