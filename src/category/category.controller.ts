import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '../../generated/prisma';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';


@ApiTags('category') // Tag pour l'interface Swagger
@Controller('category')
export class CategoryController {
  
  // N'oubliez pas l'injection du service
  constructor(private readonly categoryService: CategoryService) {} 

  @Post()
  @ApiCreatedResponse({ 
    description: 'The category has been successfully created.', type: CreateCategoryDto })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Le contrôleur appelle simplement le service
    return this.categoryService.create(createCategoryDto);
  }

  @Get() 
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
