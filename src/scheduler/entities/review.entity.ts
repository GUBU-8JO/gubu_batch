import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Platform } from './platforms.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn({ type: 'int', comment: '후기 id' })
  id: number;

  @Column({ type: 'int', comment: '사용자 id' })
  userId: number;

  @Column({ type: 'int', comment: '플랫폼 id' })
  platformId: number;

  @Column({ type: 'int', comment: '평점' })
  @IsNotEmpty({ message: '별점를 적어주세요.' })
  @IsNumber()
  rate: number;

  @Column({ type: 'text', comment: '후기 내용' })
  @IsNotEmpty({ message: '후기를 남겨주세요' })
  comment: string;

  @CreateDateColumn({ type: 'datetime', comment: '후기 생성 날짜' })
  createdAt: number;

  @DeleteDateColumn({ type: 'datetime', comment: '후기 삭제 날짜' })
  DeletedAt: number;

  @ManyToOne(() => Platform, (platform) => platform.review)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;

  @ManyToOne(() => User, (user) => user.review)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
