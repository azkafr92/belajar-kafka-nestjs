import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { createServer as createHttpServer } from 'http';
import { ShutdownObserver } from './app.observer';
import { Interceptor } from './app.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  const configService = app.get(ConfigService);
  const shutdownObserver = app.get(ShutdownObserver);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'test',
        brokers: ['172.18.148.128:9092'],
      },
      consumer: {
        groupId: 'test',
      },
    },
  });

  app.useGlobalInterceptors(new Interceptor());

  const httpServer = createHttpServer(server).listen(
    configService.get('PORT') || 3002,
  );

  shutdownObserver.addHttpServer(httpServer);

  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
