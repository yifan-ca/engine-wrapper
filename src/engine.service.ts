import { EngineChain } from 'node-uci';
import { Injectable } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

export interface MoveCommand {
  position: string;
  movetime: number;
  moves: string[];
}

@Injectable()
export class EngineService {
  constructor(private readonly engine: EngineChain) {}

  @RabbitRPC({
    exchange: process.env.EXCHANGE_NAME,
    routingKey: process.env.ROUTING_KEY,
    queue: process.env.QUEUE_NAME,
  })
  async move(command: MoveCommand) {
    return await this.engine
      .position(command.position, command.moves)
      .go({ movetime: command.movetime });
  }
}
