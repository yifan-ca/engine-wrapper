import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EngineModule } from './engine/engine.module';
import { HealthModule } from './health/health.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EngineModule,
    HealthModule,
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
