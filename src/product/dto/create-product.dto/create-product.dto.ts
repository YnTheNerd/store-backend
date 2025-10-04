import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
  IsOptional,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // Transformation des strings en numbers
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsPositive()
  stock: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsPositive()
  categoryId: number;
}
