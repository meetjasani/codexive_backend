import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("category")
export default class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  category: string;

  @Column({ default: null })
  category_type: string;

  @Column({
    default: null,
  })
  parent_category_id: string;

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
