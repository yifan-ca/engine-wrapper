import * as fs from 'fs';
import * as mustache from 'mustache';
import * as path from 'path';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const filename = path.join(__dirname, '..', 'static', 'mtod.txt');
  const content = fs.readFileSync(filename, 'utf-8');
  console.log(
    mustache.render(content, {
      engine: process.env.ENGINE_PATH,
      exchange: process.env.EXCHANGE_NAME,
      routing: process.env.ROUTING_KEY,
      queue: process.env.QUEUE_NAME,
      version: process.env.npm_package_version,
      license: process.env.npm_package_license,
    }),
  );

  const app = await NestFactory.create(AppModule);
  await app.listen(0);
}
bootstrap();
