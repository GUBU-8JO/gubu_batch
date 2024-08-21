import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import { RedisService } from './redis/redis.service';
import { SlackService } from '../slack/slack.service';
import { ReviewRepository } from './repository/review.repository';
import { PlatformRepository } from './repository/platform.repository';
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @InjectRepository(Notification)
    //private notificationRepository: Repository<Notification>,
    @InjectRepository(SubscriptionHistory)
    private readonly //private subscriptionHistoriesRepository: Repository<SubscriptionHistory>,
    redisService: RedisService,
    private readonly slackService: SlackService,
    private readonly reviewRepository: ReviewRepository,
    private readonly platformRepository: PlatformRepository,
  ) {}

  /** 평점 계산 스케쥴링 */
  @Cron('* 0 */1 * * *')
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

  @Cron('10 * * * * *')
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
