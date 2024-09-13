import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobalMiddleware } from './middlewares/logger.middleware';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CategoriesRepository } from './modules/categories/categories.repository';
import { ProductsRepository } from './modules/products/products.repository';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(LoggerGlobalMiddleware);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Back-End Application')
    .setDescription('Proyecto Back-end de Thiago Milanca')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const categoryPreload = app.get(CategoriesRepository);
  const productPreload = app.get(ProductsRepository);

  await categoryPreload.addCategories();
  await productPreload.addProduct();

  await app.listen(3000);
  console.log('Successfully Connection :)');
}

async function bootstrapWithLoad() {
  await bootstrap();
}

bootstrapWithLoad();
