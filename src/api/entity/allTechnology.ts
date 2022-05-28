import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("alltechnology")
export default class AllTechnology {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    type: string;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    image: string;

    @Column({ default: null })
    firstColor: string;

    @Column({ default: null })
    secondColor: string;

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
