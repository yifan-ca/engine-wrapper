import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { NatsOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from '@nestjs/config';
import { EngineHealthIndicator } from '../engine/health/engine.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly config: ConfigService,
    private readonly engine: EngineHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.engine.checkReady('engine'),
      // The process should not use more than 300MB memory
      async () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      // The process should not have more than 1GB allocated
      async () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),
      // The used disk storage should not exceed 70% of the full disk size
      async () =>
        this.disk.checkStorage('disk', { thresholdPercent: 0.7, path: '/' }),
      async () =>
        this.microservice.pingCheck<NatsOptions>('nats', {
          transport: Transport.NATS,
          options: {
            url: this.config.get<string>('NATS_URL'),
          },
        }),
    ]);
  }
}
