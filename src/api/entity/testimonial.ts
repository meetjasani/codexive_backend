import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("testimonial")
export default class Testimonial {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    image: string;

    @Column({ default: null })
    testimonial: string;
    
    @Column({ default: null })
    position: string;

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