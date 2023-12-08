import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Chat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user1_id' })
    user1: Relation<User>;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user2_id' })
    user2: Relation<User>;
}
