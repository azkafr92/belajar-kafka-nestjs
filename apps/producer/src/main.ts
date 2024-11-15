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

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  const configService = app.get(ConfigService);
  const shutdownObserver = app.get(ShutdownObserver);

  app.useGlobalInterceptors(new Interceptor());

  const httpServer = createHttpServer(server).listen(
    configService.get('PORT') || 3001,
  );

  shutdownObserver.addHttpServer(httpServer);

  await app.init();
}
bootstrap();
