import { IsNotEmpty } from 'class-validator';
import { Notifications } from './notification.entity';
import { UserSubscriptions } from './user-subscription.entity';
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
    () => UserSubscriptions,
    (userSubscription) => userSubscription.user,
  )
  userSubscription: UserSubscriptions[];

  @OneToMany(() => Notifications, (notification) => notification.user)
  notification: Notifications[];
}
