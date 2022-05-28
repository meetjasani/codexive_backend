import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("services_detail")
export default class ServicesDetails {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    details: string;

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