import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    tokenId: string;

    @Column()
    userId: number;

    @Column('text')
    token: string;

    @Column({
        type: "timestamp",
    })
    createdAt: Date;
}
