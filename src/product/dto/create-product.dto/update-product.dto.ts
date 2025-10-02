// src/product/dto/update-product.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// @PartialType() prend CreateProductDto et crée une nouvelle classe
// où tous les champs (name, price, stock...) sont rendus optionnels.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
