import { ConfigModule, ConfigService } from '@nestjs/config';

import { Engine } from 'node-uci';
import { EngineHealthIndicator } from './health/engine.health';
import { EngineService } from './service/engine.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Engine,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const engine = new Engine(config.get('ENGINE_PATH'));
        await engine.init();
        await engine.isready();
        return engine;
      },
    },
    EngineHealthIndicator,
    EngineService,
  ],
  exports: [EngineHealthIndicator, EngineService],
})
export class EngineModule {}
