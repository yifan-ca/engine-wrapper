import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

import { EngineHealthIndicator } from 'src/engine/engine.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly engine: EngineHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.engine.ping('engine'),
      async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
      async () =>
        this.disk.checkStorage('disk', { thresholdPercent: 0.75, path: '/' }),
    ]);
  }
}
