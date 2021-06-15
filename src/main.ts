import * as compression from 'compression';
import * as helmet from 'helmet';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { DynamicPatternService } from './decorators/dynamic-pattern.service';
import { EngineController } from './engine/engine.controller';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

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

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle(process.env.npm_package_name)
    .setDescription(
      `${process.env.npm_package_description} (rev: ${process.env.GIT_REV})`,
    )
    .setVersion(process.env.npm_package_version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT);
}
bootstrap();
