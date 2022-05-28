import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("career_request")
export default class CareerRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  first_name: string;

  @Column({ default: null })
  last_name: string;

  @Column({ default: null })
  career_requirement: string;

  @Column({ default: null })
  experiance: string;

  @Column({ default: null })
  current_company: string;

  @Column({ default: null })
  resume: string;

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
