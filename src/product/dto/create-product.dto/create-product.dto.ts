// src/product/dto/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
} from 'class-validator';

import { Transform } from 'class-transformer';

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

  // Transformation des strings en numbers
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsPositive()
  // Stock (Entier, Obligatoire)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  stock: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsPositive()
  // Clé étrangère vers la Catégorie (Entier, Obligatoire)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;
}
