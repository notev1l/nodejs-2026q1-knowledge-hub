import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Knowledge Hub')
    .setDescription('Knowledge hub service for managing articles, categories, and comments')
    .setVersion('1.0.0')
    .setContact('notev1l', 'https://github.com/notev1l', '')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/doc', app, document)

  await app.listen(4000);
}
bootstrap();
