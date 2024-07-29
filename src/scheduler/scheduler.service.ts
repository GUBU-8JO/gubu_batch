import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { UserSubscriptions } from './entities/user-subscription.entity';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { SubscriptionHistories } from './entities/subscription-histories.entity';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserSubscriptions)
    private userSubscriptionsRepository: Repository<UserSubscriptions>,
    @InjectRepository(Notifications)
    private notificationRepository: Repository<Notifications>,
    @InjectRepository(SubscriptionHistories)
    private subscriptionHistoriesRepository: Repository<SubscriptionHistories>,
  ) {}

  @Cron('00 47 16 * * *')
  async handleCron() {
    this.logger.debug('알림 시작!');

    // 결제 이력 가져오기
    const subscriptionHistories =
      await this.subscriptionHistoriesRepository.find({
        relations: ['userSubscription', 'userSubscription.user'],
      });
    console.log('결제이력', subscriptionHistories);

    // today 설정
    const today = new Date();
    // 날짜만 필요해서 시간은 초기화
    today.setHours(0, 0, 0, 0);
    console.log('today', today);
    // 결제정보 순회하면서 다음 결제일 가져오기
    for (const subscriptionHistory of subscriptionHistories) {
      // 결제일 설정(일단, 결제 시작일)
      const payDate = subscriptionHistory.nextDate;
      console.log('payDate', payDate);
      // 알람일 설정(결제일 -1)
      const notifyingDate = new Date(payDate);
      notifyingDate.setDate(notifyingDate.getDate() - 1);
      notifyingDate.setHours(0, 0, 0, 0);
      console.log('notifyingDate', notifyingDate);

      // today와 notifyingDate 비교
      if (notifyingDate.getTime() === today.getTime()) {
        const userNickname = subscriptionHistory.userSubscription.user.nickname;
        const message = `${userNickname}님 결제일 1일 전입니다.`;
        console.log(message);

        // notification DB에 저장
        const newNotification = this.notificationRepository.create({
          userId: subscriptionHistory.userSubscription.userId,
          userSubscriptionId: subscriptionHistory.userSubscriptionId,
          title: message,
          isRead: false,
          createdAt: new Date(),
          readedAt: new Date(), // Default를 null로 지정필요
        });
        console.log('알림 발생', newNotification);
        await this.notificationRepository.save(newNotification);

        // subscriptionHistory의 NextDate 업데이트
        const nextPayDate = new Date(payDate);
        nextPayDate.setMonth(nextPayDate.getMonth() + 1);
        await this.subscriptionHistoriesRepository.update(subscriptionHistory, {
          nextDate: nextPayDate,
        });
      } else {
        // 알림 미생성 테스트를 위해 추가
        const userNickname = subscriptionHistory.userSubscription.user.nickname;
        console.log('알림 미발생', `${userNickname} 알림받을 날짜가 아닙니다`);
      }
    }
  }
}
