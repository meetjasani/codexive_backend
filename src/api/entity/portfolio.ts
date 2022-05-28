import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("portfolio")
export default class Portfolio {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  main_image: string;

  @Column({ default: null })
  image: string;

  @Column({ default: null })
  introduction: string;

  @Column({ default: null })
  key_features: string;

  @Column({ default: null })
  technical_overview: string;

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
