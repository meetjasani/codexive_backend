import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("email_setting")
export default class EmailSetting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  username: string;

  @Column({ default: null })
  password: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;

}
