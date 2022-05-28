import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("counter_section")
export default class CounterSection {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    main_title: string;

    @Column({ default: null })
    counterData: string;

    @Column({ default: null })
    // image: string;

    // @Column({ default: null })
    // firstColor: string;

    // @Column({ default: null })
    // secondColor: string;

    // @Column({ default: null })
    // thirdColor: string;

    // @Column({ default: null })
    // number_input: number;

    // @Column({ default: null })
    // symbol: string;

    // @Column({ default: null })
    // title: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;
}