import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("contect_us")
export default class ContectUs {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  first_name: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  phone_no: string;

  @Column({ default: null })
  website: string;

  @Column({ default: null })
  message: string;

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
