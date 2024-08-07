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
  @PrimaryGeneratedColumn({ comment: '사용자 id' })
  id: number;

  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Column({ comment: '사용자 닉네임' })
  nickname: string;

  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @Column({ comment: '사용자 이메일' })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @Column({ select: false, comment: '비밀번호' })
  password: string;

  @CreateDateColumn({ type: 'datetime', comment: '회원가입한 날짜' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '정보 수정한 날짜' })
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
