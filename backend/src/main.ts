import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ClassValidatorPipe } from './common/validators/class-validator';
import helmet from 'helmet';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { sessionConstants } from './common/constants/session';
import connectRedis from './redis/redis.client';
import { LoggerInterceptor } from './common/log/logger.middleware';
const { secret, resave, saveUninitialized, cookie } = sessionConstants;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = app.getHttpAdapter()?.getInstance() as any;
  if (server && typeof server.set === 'function') {
    server.set('trust proxy', 1);
  }

  const redis = await connectRedis();

  app.use(cookieParser());

  console.log(JSON.stringify(cookie));

  app.use(
    session({
      secret,
      resave,
      saveUninitialized,
      cookie: cookie,
      store: redis,
    }),
  );

  app.useGlobalPipes(new ClassValidatorPipe());

  app.useGlobalInterceptors(new LoggerInterceptor());

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.use(helmet());

  await app.listen(process.env.PORT ?? 8000);

  Logger.log(
    ` Application is running on: http://localhost:${process.env.PORT ?? 8000}`,
  );
}
bootstrap();
