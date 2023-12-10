import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Chat } from './Chat.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => Chat, { cascade: true })
  @JoinColumn({ name: 'chatId' })
  chat: Chat

  @Column('text')
  messageText: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

}