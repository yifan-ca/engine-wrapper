import { Injectable, Logger } from '@nestjs/common';

import { Engine } from 'node-uci';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

export interface MoveCommand {
  position: string;
  movetime: number;
  moves: string[];
}

@Injectable()
export class EngineService {
  private readonly logger = new Logger(EngineService.name);

  constructor(private readonly engine: Engine) {}

  @RabbitRPC({
    exchange: process.env.EXCHANGE_NAME,
    routingKey: process.env.ROUTING_KEY,
    queue: process.env.QUEUE_NAME,
  })
  async move(command: MoveCommand) {
    const result = await this.engine
      .chain()
      .position(command.position, command.moves)
      .go({ movetime: command.movetime });
    this.logger.log(JSON.stringify(result.bestmove), JSON.stringify(command));
    return result;
  }
}
