import { UserSubscription } from './user-subscription.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class SubscriptionHistory {
  @PrimaryGeneratedColumn({ type: 'int', comment: '구독내역 id' })
  id: number;

  @Column({ type: 'int', comment: '사용자 구독id' })
  userSubscriptionId: number;

  @Column({ type: 'date', comment: '구독 결제 시작일' })
  startAt: Date;

  @Column({ type: 'date', comment: '다음 구독 결제일' })
  nextPayAt: Date;

  @Column({ comment: '결제 가격' })
  price: number;

  @Column({ type: 'date', nullable: true, comment: '구독 중지일' })
  stopRequestAt?: Date;

  @ManyToOne(
    () => UserSubscription,
    (userSubscription) => userSubscription.subscriptionHistory,
    { createForeignKeyConstraints: false },
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscription;
}
