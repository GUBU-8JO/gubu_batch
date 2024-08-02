import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Notification } from './notification.entity';
import { SubscriptionHistory } from './subscription-histories.entity';
import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Platform } from './platforms.entity';

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn({ type: 'int', comment: '사용자 구독id' })
  id: number;

  @Column({ type: 'int', comment: '사용자 id' })
  userId: number;

  @Column({ type: 'int', comment: '플랫폼 id' })
  platformId: number;

  @Column({ comment: '구독 시작일' })
  @IsString()
  @IsNotEmpty({ message: '구독시작일을 입력해주세요.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.',
  })
  startedDate: string;

  @Column({ comment: '결제 수단' })
  @IsString()
  @IsNotEmpty({ message: '결제수단을 입력해주세요.' })
  paymentMethod: string;

  @Column({ type: 'int', comment: '결제 주기' })
  @IsNumber()
  @IsNotEmpty({ message: '결제주기를 입력해주세요.' })
  period: number;

  @Column({ comment: '구독 계정 아이디' })
  @IsString()
  @IsOptional()
  accountId: string;

  @Column({ comment: '구독 계정 패스워드' })
  @IsString()
  @IsOptional()
  accountPw: string;

  @Column({ comment: '구독 가격' })
  price: number;

  @CreateDateColumn({ type: 'datetime', comment: '구독 추가일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '구독 내용 수정일' })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    nullable: true,
    comment: '구독 중지일',
  })
  deletedAt: Date | null;

  @OneToMany(
    () => SubscriptionHistory,
    (subscriptionHistory) => subscriptionHistory.userSubscription,
  )
  subscriptionHistory: SubscriptionHistory[];

  @OneToMany(
    () => Notification,
    (notification) => notification.userSubscription,
  )
  notification: Notification[];

  @ManyToOne(() => Platform, (platform) => platform.userSubscription)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;

  @ManyToOne(() => User, (user) => user.userSubscription)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
