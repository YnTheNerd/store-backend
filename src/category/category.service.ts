import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '../../generated/prisma';

@Injectable()
export class CategoryService {
  // 2. Injecter le PrismaService dans le constructeur
  constructor(private prisma: PrismaService) {} 
  //             ^^^^^^^^^^^^^^^^^^^^^^^^^^

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Plus besoin de manipuler l'objet, car tous les champs sont obligatoires
    return await this.prisma.category.create({
      data: createCategoryDto, 
    });
  }
}
