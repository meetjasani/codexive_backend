import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("our_speciality")
export default class SpecialitySection {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    main_title: string;

    @Column({ default: null })
    details: string;

    @Column({ default: null })
    left_menu: string;

    @Column({ default: null })
    right_menu: string;
   
    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;
}