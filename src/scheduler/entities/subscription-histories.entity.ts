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

  @Column({ nullable: true })
  stopDate?: Date;

  @ManyToOne(
    () => UserSubscription,
    (userSubscription) => userSubscription.subscriptionHistory,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscription;
}
