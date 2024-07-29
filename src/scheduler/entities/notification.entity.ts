import { UserSubscriptions } from './user-subscription.entity';
import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  userSubscriptionId: number;

  @Column()
  title: string;

  @Column()
  isRead: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  readedAt: Date;

  @ManyToOne(() => User, (user) => user.notification, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => UserSubscriptions,
    (userSubscription) => userSubscription.notification,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscriptions;
}
