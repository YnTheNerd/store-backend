
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; 
import 'reflect-metadata';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://192.168.0.104:5173','http://192.168.0.119//:3000','http://localhost:3000'],
    methods: 'POST,GET,PATCH,PUT,DELETE,HEAD,OPTIONS',
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
  })
  // Ligne cruciale pour appliquer la validation DTO partout
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      transform: true, 
    }),
  );

  
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('Documentation des endpoints CRUD pour les produits et catégories.')
    .setVersion('1.0')
    .addTag('product') 
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  

  SwaggerModule.setup('api', app, document);

  const prisma = app.get(PrismaService);

  const superAdminEmail = 'francoiseleslie05@gmail.com';
  const superAdmin = await prisma.user.findFirst({
    where: { email: superAdminEmail },
  });

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash('123456789', 10); 
    await prisma.user.create({
      data: {
        username: 'superadmin',
        email: superAdminEmail,
        password: hashedPassword,
        address: 'Alshadows',
        role: 'superadmin',
        isActive: true,
      },
    });

    console.log('Superadmin créé avec succès !');
    console.log(`Email : ${superAdminEmail}`);
    console.log(`Mot de passe : SuperAdmin123!`);
  } else {
    console.log('Superadmin déjà existant.');
  }


  await app.listen(3000);
}
bootstrap();
