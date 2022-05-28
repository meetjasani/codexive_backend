import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("setting")
export default class Setting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  form_name: string;

  @Column({ default: null })
  is_active: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;

}
