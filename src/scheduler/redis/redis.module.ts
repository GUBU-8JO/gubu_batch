import * as redisStore from 'cache-manager-ioredis';
import { Module } from '@nestjs/common';
import {
  CacheModule as NestCacheModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    NestCacheModule.registerAsync<CacheModuleOptions>({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: configService.get<number>('REDIS_TTL'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NestCacheModule, RedisService],
  providers: [RedisService],
})
export class RedisModule {}
