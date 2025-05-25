import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'https://kupi-podari-day.nomorepartiessbs.ru',
    credentials: true, // if you're sending cookies or headers like Authorization
  });

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
void bootstrap();
