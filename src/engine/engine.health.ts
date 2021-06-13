import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

import { Engine } from 'node-uci';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EngineHealthIndicator extends HealthIndicator {
  constructor(private readonly engine: Engine) {
    super();
  }

  async ping(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.engine.isready();
      return this.getStatus(key, true);
    } catch (err) {
      const result = this.getStatus(key, false, err);
      throw new HealthCheckError(err.message, result);
    }
  }
}
