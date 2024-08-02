import { UserSubscription } from './user-subscription.entity';
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
export class Notification {
  @PrimaryGeneratedColumn({ type: 'int', comment: '알림 id' })
  id: number;

  @Column({ type: 'int', comment: '사용자 id' })
  userId: number;

  @Column({ type: 'int', comment: '구독정보 id' })
  userSubscriptionId: number;

  @Column({ comment: '알림 내역' })
  title: string;

  @Column({ default: false, comment: '알림 확인 또는 미확인' })
  isRead: boolean;

  @CreateDateColumn({ type: 'datetime', comment: '알림 생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: true,
    comment: '알림내역 확인일',
  })
  readedAt?: Date;

  @ManyToOne(() => User, (user) => user.notification, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => UserSubscription,
    (userSubscription) => userSubscription.notification,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscription;
}
