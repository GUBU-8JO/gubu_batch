import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import { Review } from './entities/review.entity';
import { Platform } from './entities/platforms.entity';
import { RedisService } from './redis/redis.service';
import {SlackService} from '../slack/slack.service'
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(SubscriptionHistory)
    private subscriptionHistoriesRepository: Repository<SubscriptionHistory>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,
    private readonly redisService: RedisService,
    private readonly slackService: SlackService, 
  ) {}

  /** 알림 생성 스케쥴링 */
  @Cron('10 * * * * *')
  async createNotification() {
    this.logger.debug('알림 시작!');

    try {
      // 다음 결제일이 내일인 결제 이력 가져오기
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
      tomorrow.setDate(tomorrow.getDate() + 1);

      const subscriptionHistories =
        await this.subscriptionHistoriesRepository.find({
          where: {
            nextPayAt: tomorrow,
            stopRequestAt: IsNull(),
          },
          relations: [
            'userSubscription',
            'userSubscription.user',
            'userSubscription.platform',
          ],
        });
      console.log('내일인 결제이력', subscriptionHistories);

      if (subscriptionHistories.length > 0) {
        const notifications = subscriptionHistories.map((subscriptionHistory) => {
          const userNickname = subscriptionHistory.userSubscription.user.nickname;
          const platformTitle =
            subscriptionHistory.userSubscription.platform.title;
          const message = `${userNickname}님 ${platformTitle} 결제일 1일 전입니다.`;

          return this.notificationRepository.create({
            userId: subscriptionHistory.userSubscription.userId,
            userSubscriptionId: subscriptionHistory.userSubscriptionId,
            title: message,
            isRead: false,
            createdAt: new Date(),
            readedAt: null,
          });
        });
        await this.notificationRepository.save(notifications);
        console.log('알림 발생', notifications);

        const updatePromises = subscriptionHistories.map(
          (subscriptionHistory) => {
            const nextPayDate = new Date(subscriptionHistory.nextPayAt);
            const period = subscriptionHistory.userSubscription.period;
            nextPayDate.setMonth(nextPayDate.getMonth() + period);

            return this.subscriptionHistoriesRepository.update(
              subscriptionHistory.id,
              {
                nextPayAt: nextPayDate,
              },
            );
          },
        );
        await Promise.all(updatePromises);
      } else {
        this.logger.debug('알림을 생성할 결제 이력이 없습니다.');
      }
    } catch (err) {
      this.logger.error('알림 생성 실패', err.stack);
      await this.slackService.sendMessage('알림 생성에 실패했습니다.');
    }
  }


 

  /** 평점 계산 스케쥴링 */
  @Cron('0/10 * * * * *')
  async ratingCalculation() {
    this.logger.debug('평점 계산 시작!');

    // 리뷰 가져오기
    const platformsReview = await this.reviewRepository.find({
      select: ['rate', 'platformId'],
    });

    // platform의 review 그룹화하기
    const platformReviews = {};

    // platformId에 맞는 rate 추가
    for (const review of platformsReview) {
      // rate 없으면 빈 배열
      if (!platformReviews[review.platformId]) {
        platformReviews[review.platformId] = [];
      }
      platformReviews[review.platformId].push(review.rate);
    }

    // 가져온 거에서 리뷰의 평점만 골라서 배열로 만들어줌, 평점이 1도 없으면 빈배열

    // 각 platform의 rating 계산 후 업데이트
    for (const platformId in platformReviews) {
      const reviewRates = platformReviews[platformId];
      const totalRate = reviewRates.reduce((sum, rate) => sum + rate, 0);
      const averageRating = totalRate / reviewRates.length;
      // 만들어진 배열을 가지고 계산, 평균
      // 소수점 반올림
      const roundsRating = parseFloat(averageRating.toFixed(1));
      console.log(roundsRating, '여기');
      const data = await this.platformRepository.update(
        { id: +platformId },
        {
          rating: roundsRating,
        },
      );
      console.log('platformId :', platformId);
      console.log('data :', data);
    }
    // platform의 rating 변경하기
    // 플랫폼의 rating 칼럼에 업데이트 해주기

    const platforms = await this.platformRepository.find({
      order: { rating: 'DESC' },
      take: 10,
    });

    const cacheKey = 'platformRating';
    const jsonPlatform = JSON.stringify(platforms);
    await this.redisService.setCache(cacheKey, jsonPlatform, {
      ttl: 3600,
    } as any);
  }

  //review와 관계된 플랫폼 정보 가져오기
  async findPlatformsReview() {
    return await this.reviewRepository.find({
      relations: ['platform'],
    });
  }

  @Cron('0/10 * * * * *')
  async platformList() {
    try{
    const platforms = await this.platformRepository.find({
      select: [
        'id',
        'title',
        'price',
        'rating',
        'image',
        'categoryId',
        'purchaseLink',
        'period',
      ],
    });
    const cacheKey = 'platforms';
    await this.redisService.setCache(cacheKey, JSON.stringify(platforms), {
      ttl: 3600,
    } as any);
    console.log('플랫폼 정보를 cache에 저장했습니다.');
  }catch(err) {
      this.logger.error('캐시 저장 중 오류 발생', err.stack)
      await this.slackService.sendMessage('캐시 저장 중 오류 발생');
    }
  } 
}
