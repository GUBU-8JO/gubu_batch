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

  @Cron('00 34 15 * * *')
  async handleCron() {
    this.logger.debug('알림 테스트');

    // 결제 이력 가져오기
    const subscriptionHistories =
      await this.subscriptionHistoriesRepository.find({
        relations: ['userSubscription', 'userSubscription.user'],
      });
    console.log(subscriptionHistories);

    // today 설정
    const today = new Date();
    // 날짜만 필요해서 시간은 초기화
    today.setHours(0, 0, 0, 0);
    console.log('today', today);
    // 결제정보 순회하면서 다음 결제일 가져오기
    for (const paymentHistory of subscriptionHistories) {
      // 결제일 설정(일단, 결제 시작일)
      const payDate = paymentHistory.nextDate;
      console.log('payDate', payDate);
      // 알람일 설정(결제일 -1)
      const notifyingDate = new Date(payDate);
      notifyingDate.setDate(notifyingDate.getDate() - 1);
      notifyingDate.setHours(0, 0, 0, 0);
      console.log('notifyingDate', notifyingDate);

      // today와 notifyingDate 비교
      if (notifyingDate.getDate() == today.getDate()) {
        const message = '결제일 1일 전입니다.';
        console.log(message);

        // notification 저장
        const newNotification = this.notificationRepository.create({
          userId: paymentHistory.userSubscription.userId,
          userSubscriptionId: paymentHistory.userSubscriptionId,
          title: message,
          isRead: false,
          createdAt: new Date(),
          readedAt: new Date(),
        });
        console.log(newNotification);
        await this.notificationRepository.save(newNotification);
      }
    }
  }

  //   @Cron('00 13 18 * * *')
  //   async handleCron() {
  //     this.logger.debug('알림 테스트');

  //     // 구독 정보 가져오기
  //     const userSubscription = await this.userSubscriptionsRepository.find({
  //       relations: ['user'],
  //     });
  //     console.log(userSubscription);

  //     // today 설정
  //     const today = new Date();
  //     // 날짜만 필요해서 시간은 초기화
  //     today.setHours(0, 0, 0, 0);
  //     console.log('today', today);
  //     // 유저의 구독정보를 돌면서 결제 시작일 가져오기
  //     userSubscription.forEach(async (userSubscription) => {
  //       // 결제일 설정(일단, 결제 시작일)
  //       const payDate = userSubscription.startedDate;
  //       console.log('payDate', payDate);
  //       // 알람일 설정(결제일 -1)
  //       const notifyingDate = new Date(payDate);
  //       notifyingDate.setDate(notifyingDate.getDate() - 1);
  //       notifyingDate.setHours(0, 0, 0, 0);
  //       console.log('notifyingDate', notifyingDate);

  //       // today와 notifyingDate 비교
  //       if (notifyingDate.getDate() == today.getDate()) {
  //         const message = '결제일 1일 전입니다.';
  //         console.log(message);

  //         // notification 저장
  //         const newNotification = this.notificationRepository.create({
  //           userSubscription,
  //           userId: userSubscription.userId,
  //           userSubscriptionId: userSubscription.id,
  //           title: message,
  //           isRead: false,
  //           createdAt: new Date(),
  //         });
  //         await this.notificationRepository.save(newNotification);

  //         // Historied 저장
  //         const nextPayDate = new Date(payDate);
  //         nextPayDate.setMonth(nextPayDate.getMonth() + 1);
  //         const updateHistory = this.subscriptionHistoriesRepository.create({
  //           userSubscription,
  //           userSubscriptionId: userSubscription.id,
  //           nextDate: nextPayDate,
  //         });
  //         await this.subscriptionHistoriesRepository.save(updateHistory);
  //       }
  //     });
  //   }
}
