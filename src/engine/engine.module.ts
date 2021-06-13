import { ConfigService } from '@nestjs/config';
import { Engine } from 'node-uci';
import { EngineHealthIndicator } from './engine.health';
import { Module } from '@nestjs/common';

@Module({
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
  ],
  exports: [EngineHealthIndicator],
})
export class EngineModule {}
