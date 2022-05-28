import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("our_customer")
export default class OurCustomer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    title: string;

    @Column({ default: null })
    description: string;

    @Column({ default: null })
    customer: string;

    @Column({
        default: false,
    })
    is_deleted: boolean;

    @Column({
        type: "timestamp",
        default: null,
    })
    deleted_at: Date;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;
}