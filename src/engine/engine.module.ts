import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Scope } from '@nestjs/common';

import { Engine } from 'node-uci';
import { EngineController } from './engine.controller';
import { EngineHealthIndicator } from './health/engine.health';
import { EngineService } from './service/engine.service';

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
      scope: Scope.REQUEST,
    },
    EngineHealthIndicator,
    EngineService,
  ],
  controllers: [EngineController],
  exports: [EngineHealthIndicator, EngineService],
})
export class EngineModule {}
