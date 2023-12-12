import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Message } from './Message.entity';

@Entity()
export class Chat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, {cascade: true})
    @JoinColumn({ name: 'user1_id' })
    user1: User;
  
    @ManyToOne(() => User, {cascade: true})
    @JoinColumn({ name: 'user2_id' })
    user2: User;

    @OneToMany(() => Message, (messages) => messages.chat,  { cascade: true })
    messages: Message[];
}
