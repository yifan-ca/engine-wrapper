import { Engine, EngineChain } from 'node-uci';

import { EngineService } from './engine.service';
import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [
    {
      provide: EngineChain,
      useFactory: async () =>
        new Engine(process.env.ENGINE_PATH)
          .chain()
          .init()
          .isready()
          .ucinewgame(),
    },
    EngineService,
  ],
})
export class AppModule {}
