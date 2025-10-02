// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; 
import 'reflect-metadata';
import { PrismaService } from './prisma/prisma.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ligne cruciale pour appliquer la validation DTO partout
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés qui ne sont pas définies dans le DTO
      transform: true, // Transforme automatiquement les données entrantes en instances DTO typées
    }),
  );
  
  // --- DÉBUT DE LA CONFIGURATION SWAGGER ---
  
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('Documentation des endpoints CRUD pour les produits et catégories.')
    .setVersion('1.0')
    .addTag('product') // Ajoute un tag pour le module produit
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // L'interface de documentation sera accessible à l'URL /api
  SwaggerModule.setup('api', app, document);

  // --- FIN DE LA CONFIGURATION SWAGGER ---

  await app.listen(3000);
}
bootstrap();
