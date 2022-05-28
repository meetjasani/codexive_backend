import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("supported_technology")
export default class SupportedTechnology {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    title: string;

    @Column({ default: null })
    image: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;
}