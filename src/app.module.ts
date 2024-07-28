import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [SchedulerModule],
  controllers: [AppController],
  providers: [AppService, SchedulerService],
})
export class AppModule {}
