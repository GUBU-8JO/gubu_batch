import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async setCache(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      console.log(`Cache set for key: ${key} with value: ${value}`);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  async getCache(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async delCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async resetCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
