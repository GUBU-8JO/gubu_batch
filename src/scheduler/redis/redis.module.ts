import * as redisStore from 'cache-manager-ioredis';
import { Module } from '@nestjs/common';
import {
  CacheModule as NestCacheModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestCacheModule.register<CacheModuleOptions>({
      store: redisStore,
      host: 'redis-17544.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com', // Redis 호스트
      port: 17544, // Redis 포트
      password: 'xE9kzc66rIPGRmdoiIQ7qTNwpN9eM37k', // Redis 비밀번호
      ttl: 600, // 캐시 유지 시간(초)
    }),
  ],
  exports: [NestCacheModule, RedisService],
  providers: [RedisService],
})
export class RedisModule {}
