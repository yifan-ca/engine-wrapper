import { EngineModule } from '../engine/engine.module';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, EngineModule],
  controllers: [HealthController],
})
export class HealthModule {}
