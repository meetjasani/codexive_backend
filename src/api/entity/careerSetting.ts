import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("carrer_setting")
export default class CareerSetting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  discription: string;

  @Column({ default: null })
  key_point: string;

  @Column({ default: null })
  let_s_talk: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;

}
