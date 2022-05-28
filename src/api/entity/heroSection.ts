import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("hero_section")
export default class HeroSection {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    title: string;

    @Column({ default: null })
    image: string;

    @Column({ default: null })
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