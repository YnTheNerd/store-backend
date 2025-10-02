// src/product/dto/create-product.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  // Nom (String, Obligatoire)
  @IsString()
  @IsNotEmpty()
  name: string;

  // Description (String, Optionnel)
  @IsString()
  @IsNotEmpty()
  description: string;

  // Prix (Nombre, Obligatoire, Positif)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  // Stock (Entier, Obligatoire)
  @IsInt()
  @IsNotEmpty()
  stock: number;

  // Clé étrangère vers la Catégorie (Entier, Obligatoire)
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
