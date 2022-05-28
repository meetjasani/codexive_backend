import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("why_choose")
export default class WhyChooseSection {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    main_title: string;

    @Column({ default: null })
    section: string;

    // @Column({ default: null })
    // image: string;

    // @Column({ default: null })
    // description: string;

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