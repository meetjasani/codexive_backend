import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { MemberType } from "../../utils/constant";

@Entity("team")
export default class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  first_name: string;

  @Column({ default: null })
  last_name: string;

  @Column({ default: null })
  id_number: string;

  @Column({ default: null })
  image: string;

  @Column({ default: null })
  skill: string;

  @Column({
    type: "enum",
    enum: MemberType,
    default: null,
  })
  member_type: MemberType;

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
