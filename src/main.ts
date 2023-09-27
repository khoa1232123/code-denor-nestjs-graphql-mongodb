import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { COOKIE_NAME } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      name: COOKIE_NAME,
      cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
      secret: COOKIE_NAME,
      saveUninitialized: true,
      resave: false,
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3003'],
    credentials: true,
  });
  await app.listen(4000);
}

bootstrap();
