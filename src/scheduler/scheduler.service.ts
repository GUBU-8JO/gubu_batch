import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import { RedisService } from './redis/redis.service';
import format from 'date-format';

import { SlackService } from '../slack/slack.service';
import { ReviewRepository } from './repository/review.repository';
import { PlatformRepository } from './repository/platform.repository';
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(SubscriptionHistory)
    private subscriptionHistoriesRepository: Repository<SubscriptionHistory>,
    private readonly redisService: RedisService,
    private readonly slackService: SlackService,
    private readonly reviewRepository: ReviewRepository,
    private readonly platformRepository: PlatformRepository,
  ) {}

  /** 알림 생성 스케쥴링 */
  @Cron('0/10 * * * * *')
  async createNotification() {
    this.logger.debug('알림 시작!');

    // 다음 결제일이 내일인 결제 이력 가져오기
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

    const subscriptionHistories =
      await this.subscriptionHistoriesRepository.find({
        where: {
          nextPayAt: today,
          stopRequestAt: IsNull(),
        },
        relations: [
          'userSubscription',
          'userSubscription.user',
          'userSubscription.platform',
        ],
      });
    console.log('내일인 결제이력', subscriptionHistories);

    const updatePromises = subscriptionHistories.map((subscriptionHistory) => {
      const nextPayDate = new Date(subscriptionHistory.nextPayAt);

      // 현재 날짜를 포맷팅하여 출력 (이 단계에서는 단순히 확인 용도)
      const formattedDate = format('yyyy-MM-dd', nextPayDate);

      // 현재 날짜의 월 추출
      const currentMonth = nextPayDate.getMonth(); // 월은 0부터 시작 (0 = January)

      // 구독 주기를 더하여 새로운 결제 날짜 설정
      const period = subscriptionHistory.userSubscription.period;
      nextPayDate.setMonth(currentMonth + period); // setMonth는 0부터 시작하는 월을 기대합니다.

      // 새로운 결제 날짜를 포맷팅
      const nextPaySetDate = format('yyyy-MM-dd', nextPayDate);

      return this.subscriptionHistoriesRepository.save({
        userSubscriptionId: subscriptionHistory.id,
        price: subscriptionHistory.price,
        startAt: formattedDate,
        nextPayAt: nextPaySetDate,
      });
    });
    await Promise.all(updatePromises);
  }

  /** 평점 계산 스케쥴링 */
  @Cron('* 10 * * * *')
  async ratingCalculation() {
    this.logger.debug('평점 계산 시작!');

    const platformsRatings = await this.reviewRepository.platformRating();

    const platformIdRating = platformsRatings
      .map((platform) => `(${platform.id}, ${platform.rating})`)
      .join(', ');

    const ratingUpdate =
      await this.platformRepository.updateRating(platformIdRating);
    console.log(ratingUpdate);
    const topPlatforms = platformsRatings.slice(0, 10);

    const cacheKey = 'topPlatforms';

    await this.redisService.setCache(cacheKey, JSON.stringify(topPlatforms), {
      ttl: 3600,
    } as any);
  }


  @Cron('* 10 * * * *')
  async platformList() {
    try {
      const platforms = await this.platformRepository.findPlatforms();
      const cacheKey = 'platforms';
      await this.redisService.setCache(cacheKey, JSON.stringify(platforms), {
        ttl: 3600,
      } as any);
      console.log('플랫폼 정보를 cache에 저장했습니다.');
    } catch (err) {
      this.logger.error('캐시 저장 중 오류 발생', err.stack);
      await this.slackService.sendMessage('캐시 저장 중 오류 발생');
    }
  }
}
