import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { Ctx, NatsContext, Payload } from '@nestjs/microservices';
import { DynamicMessagePattern } from '../decorators/dynamic-message.pattern';
import { MoveRequestDto } from './dto/move-request.dto';
import { MoveResponseDto } from './dto/move-response.dto';
import { EngineService } from './service/engine.service';

@Controller('/engine')
export class EngineController {
  private readonly logger = new Logger(EngineController.name);

  constructor(private readonly service: EngineService) {}

  @Post()
  @HttpCode(200)
  async post(@Body() data: MoveRequestDto) {
    const result = await this.service.move({ ...data });
    return { bestmove: result.bestmove };
  }

  @DynamicMessagePattern('NATS_SUBJECT')
  async move(
    @Payload() data: MoveRequestDto,
    @Ctx() context: NatsContext,
  ): Promise<MoveResponseDto> {
    this.logger.debug(
      `Input: ${JSON.stringify(data)}`,
      JSON.stringify(context),
    );
    const result = await this.service.move({ ...data });
    this.logger.debug(
      `Output: ${JSON.stringify(result)}`,
      JSON.stringify(context),
    );
    return { bestmove: result.bestmove };
  }
}
