import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { RoleType } from "../../utils/constant";

@Entity("user")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  last_name: string;

  @Column({ default: null })
  first_name: string;

  @Column({
    default: null
  })
  email: string;

  @Column({
    default: null
  })
  password: string;

  @Column({
    type: "enum",
    enum: RoleType,
    default: null,
  })
  role_type: RoleType;

  @Column({
    default: false,
  })
  is_login_first: boolean;

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
