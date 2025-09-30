import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'my_queue',
      queueOptions: { durable: true },
    },
  });

  const allowedOrigins = [
    'http://localhost:3010',
    'http://localhost:3011',
    'http://127.0.0.1:3010',
    'http://127.0.0.1:3011',
  ];
  app.enableCors({
    origin: allowedOrigins, // Replace with your frontend URL(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow sending of cookies/authentication tokens
  });

  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const formatError = (error: ValidationError) => {
          if (error.children?.length) {
            return {
              // field: error.property,
              // errors: error.children.map(formatError),
              [error.property]: error.children.map(formatError),
            };
          }
          // return {
          //   field: error.property,
          //   errors: Object.values(error.constraints ?? {}),
          // };
          return {
            [error.property]: Object.values(error.constraints ?? {}),
          };
        };

        return new BadRequestException(
          validationErrors.map((error: ValidationError): any =>
            formatError(error),
          ),
        );
      },
      // disableErrorMessages: true,
    }),
  );
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
