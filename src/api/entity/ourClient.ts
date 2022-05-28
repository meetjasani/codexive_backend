import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("our_client")
export default class OurClient {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    clientInfo: string;

    @Column({ default: null })
    image: string;

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
