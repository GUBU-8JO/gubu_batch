import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscriptions } from './entities/user-subscription.entity';
import { SubscriptionHistories } from './entities/subscription-histories.entity';
import { Notifications } from './entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSubscriptions,
      SubscriptionHistories,
      Notifications,
    ]),
  ],
  providers: [SchedulerService],
  controllers: [SchedulerController],
})
export class SchedulerModule {}
