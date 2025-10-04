// src/product/dto/final-product-data.dto.ts

import { CreateProductDto } from './create-product.dto';

// Type que le service attend vraiment
export class FinalProductData {
  name: string;
  description: string;
  image: string; // URL Cloudinary
  price: number;
  stock: number;
  categoryId: number;
}
