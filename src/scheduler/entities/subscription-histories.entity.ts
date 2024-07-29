import { UserSubscriptions } from './user-subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SubscriptionHistories {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userSubscriptionId: number;

  @Column()
  startedDate: Date;

  @Column()
  nextDate: Date;

  @Column()
  price: number;

  @Column()
  stopDate: Date;

  @ManyToOne(
    () => UserSubscriptions,
    (userSubscription) => userSubscription.subscriptionHistory,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscriptions;
}
