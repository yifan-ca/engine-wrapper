import * as compression from 'compression';
import * as helmet from 'helmet';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { DynamicPatternService } from './decorators/dynamic-pattern.service';
import { EngineController } from './engine/engine.controller';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.get(DynamicPatternService).processDecorators([EngineController]);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      url: process.env.NATS_URL,
    },
  });

  app.use(compression());
  app.use(helmet());

  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT);
}
bootstrap();
