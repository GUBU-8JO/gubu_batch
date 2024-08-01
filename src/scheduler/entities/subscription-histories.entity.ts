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
  @Column({ type: Date, comment: '구독 결제 시작일' })
  startAt: Date;
  //저희는 시작일로부터 정해진 주기마다 계속 결제가 되고 중지를 눌렀을때 구독이 중지된다 생각해서 nextAt이 갱신일이 아닌 다음 결제일이라고 생각했습니다.
  //매 달마다 갱신을 해주는 거라 생각을 한다면 endAt이 맞는데 어떻게 생각하시나요..?
  @Column({ comment: '다음 구독 결제일' })
  nextPayAt: Date;
  @Column({ comment: '결제 가격' })
  price: number;
  @Column({ nullable: true, comment: '구독 중지일' })
  stopRequestAt?: Date;
  @ManyToOne(
    () => UserSubscription,
    (userSubscription) => userSubscription.subscriptionHistory,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscription;
}
