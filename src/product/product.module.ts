import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [CloudinaryModule]
})
export class ProductModule {}
