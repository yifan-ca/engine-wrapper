import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnginesModule } from './engines/engines.module';
import { HealthModule } from './health/health.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnginesModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
