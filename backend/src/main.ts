import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ClassValidatorPipe } from './common/validators/class-validator';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { LoggerInterceptor } from './common/log/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = app.getHttpAdapter()?.getInstance() as any;
  if (server && typeof server.set === 'function') {
    server.set('trust proxy', 1);
  }

  app.use(cookieParser());

  app.useGlobalPipes(new ClassValidatorPipe());

  app.useGlobalInterceptors(new LoggerInterceptor());

  app.enableCors({
    origin: ['http://localhost:3000', 'http://frontend.localhost'],
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
