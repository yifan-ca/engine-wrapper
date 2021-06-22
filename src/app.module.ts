import { Engine } from 'node-uci';
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
      provide: Engine,
      useFactory: async () => {
        const engine = new Engine(process.env.ENGINE_PATH);
        await engine.init();
        await engine.isready();
        await engine.ucinewgame();
        return engine;
      },
    },
    EngineService,
  ],
})
export class AppModule {}
