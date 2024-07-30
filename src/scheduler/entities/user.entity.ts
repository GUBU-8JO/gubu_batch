import { IsNotEmpty } from 'class-validator';
import { Notification } from './notification.entity';
import { Review } from './review.entity';
import { UserSubscription } from './user-subscription.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Column()
  nickname: string;

  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @Column()
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @Column({ select: false })
  password: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @OneToMany(
    () => UserSubscription,
    (userSubscription) => userSubscription.user,
  )
  userSubscription: UserSubscription[];

  @OneToMany(() => Review, (review) => review.user)
  review: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notification: Notification[];
}
///
