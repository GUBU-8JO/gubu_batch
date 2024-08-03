import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscription } from './entities/user-subscription.entity';
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import { Notification } from './entities/notification.entity';
import { Review } from './entities/review.entity';
import { Platform } from './entities/platforms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSubscription,
      SubscriptionHistory,
      Notification,
      Review,
      Platform,
    ]),
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
