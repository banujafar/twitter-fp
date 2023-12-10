import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Chat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user1_id' })
    user1: User;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user2_id' })
    user2: User;
}
