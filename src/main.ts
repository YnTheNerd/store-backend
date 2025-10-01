import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Ecommerce Manager API')
  .setDescription('Ecommerce Manager API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const prisma = app.get(PrismaService);
  const adminEmail = 'francoiseleslie05@gmail.com';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('123456789', 10);

    await prisma.user.create({
      data: {
        username: 'SuperAdmin',
        email: adminEmail,
        password: passwordHash,
        address: 'HQ',
        isActive: true,        
        role: 'superadmin',    
      },
    });

    console.log(' Super admin créé avec succès !');
  } else {
    console.log(' Super admin déjà existant.');
  }

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
