import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

import { EngineHealthIndicator } from '../engine/engine.health';

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
      async () => this.engine.checkReady('engine'),
      // The process should not use more than 100MB memory
      async () => this.memory.checkHeap('memory_heap', 100 * 1024 * 1024),
      // The process should not have more than 300MB allocated
      async () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      // The used disk storage should not exceed 70% of the full disk size
      async () =>
        this.disk.checkStorage('disk', { thresholdPercent: 0.7, path: '/' }),
    ]);
  }
}
