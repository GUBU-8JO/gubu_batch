import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscription } from './entities/user-subscription.entity';
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import { Notification } from './entities/notification.entity';
import { Review } from './entities/review.entity';
import { Platform } from './entities/platforms.entity';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { SlackModule } from 'src/slack/slack.module';

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
    RedisModule,
    SlackModule,
  ],
  providers: [SchedulerService, RedisService],
})
export class SchedulerModule {}
