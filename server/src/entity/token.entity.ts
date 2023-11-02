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
        default: () => `CURRENT_TIMESTAMP + interval '10800 seconds'`, // Set default to 3600 seconds from current time
    })
    createdAt: Date;
}
