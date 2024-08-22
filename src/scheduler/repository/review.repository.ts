import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
  ) {}
  async platformRating() {
    const rating = await this.repository.query(`
        SELECT platform.id, platform.title, ROUND(AVG(review.rate), 1) AS rating
        FROM platform
        JOIN review ON platform.id = review.platform_id
        GROUP BY platform.id, platform.title
        ORDER BY rating DESC;`);

    return rating;
  }
}
