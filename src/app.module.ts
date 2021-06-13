import * as fs from 'fs';
import * as mustache from 'mustache';
import * as path from 'path';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { EngineModule } from './engine/engine.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    EngineModule,
    HealthModule,
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly config: ConfigService) {}

  async onApplicationBootstrap() {
    const filename = path.join(__dirname, '..', 'static', 'mtod.txt');
    const content = fs.readFileSync(filename, 'utf-8');
    process.stdout.write(
      mustache.render(content, { enginePath: this.config.get('ENGINE_PATH') }),
    );
  }
}
