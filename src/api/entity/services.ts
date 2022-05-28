import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
@Entity("services")
export default class Service {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        default: null,
    })
    main_service: string;

    @Column({
        default: null,
    })
    sub_services_id: string;

    @Column({
        default: null,
    })
    sub_services: string;

    @Column({
        default: null,
    })
    title: string;

    @Column({
        default: null,
    })
    description: string;

    @Column({
        default: null,
    })
    image: string;

    @Column({
        default: null,
    })
    title_second: string;

    @Column({
        default: null,
    })
    description_second: string;

    @Column({
        default: null,
    })
    image_second: string;

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
