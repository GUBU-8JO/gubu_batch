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
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  platformId: number;

  @Column({ type: 'int' })
  @IsNotEmpty({ message: '별점를 적어주세요.' })
  @IsNumber()
  rate: number;

  @Column({ type: 'text' })
  @IsNotEmpty({ message: '후기를 남겨주세요' })
  comment: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: number;

  @DeleteDateColumn({ type: 'datetime' })
  DeletedAt: number;

  @ManyToOne(() => Platform, (platform) => platform.review)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;

  @ManyToOne(() => User, (user) => user.review)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
