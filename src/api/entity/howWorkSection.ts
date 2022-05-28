import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("how_we_section")
export default class HowWorkSection {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    main_title: string;

    @Column({ default: null })
    title: string;

    @Column({ default: null })
    image: string;

    @Column({ default: null })
    details: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;
}