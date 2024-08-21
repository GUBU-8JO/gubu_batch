import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from '../entities/platforms.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlatformRepository {
  constructor(
    @InjectRepository(Platform)
    private readonly repository: Repository<Platform>,
  ) {}

  async updateRating(platformIdRating) {
    const updatePlatform = await this.repository
      .query(`INSERT INTO platform (id, rating)
      VALUES ${platformIdRating}
      ON DUPLICATE KEY UPDATE rating = VALUES(rating);
    `);
    return updatePlatform;
  }

  async findPlatforms() {
    const platforms = await this.repository.find({
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
    return platforms;
  }
}
