// src/category/dto/create-category.dto.ts

import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the category (e.g., Electronics)' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  // Le champ est maintenant obligatoire
  @ApiProperty({ description: 'A description for the category.' })
  @IsString()
  @IsNotEmpty() 
  description: string; // <-- PLUS DE '?'
}
