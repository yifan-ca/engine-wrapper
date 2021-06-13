import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

import { EngineService } from './engine.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EngineHealthIndicator extends HealthIndicator {
  constructor(private readonly service: EngineService) {
    super();
  }

  async checkReady(key: string): Promise<HealthIndicatorResult> {
    return this.service
      .ready()
      .then(() => this.getStatus(key, true))
      .catch((err) => {
        const result = this.getStatus(key, false, err);
        throw new HealthCheckError(err.message, result);
      });
  }
}
