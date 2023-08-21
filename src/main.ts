import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { COOKIE_NAME } from './constants';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      name: COOKIE_NAME,
      cookie: {
        maxAge: 1000 * 60 * 60,
      },
      secret: COOKIE_NAME,
      saveUninitialized: true,
      resave: false,
    }),
  );
  await app.listen(4000);
}

bootstrap();
