import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("career_requirement")
export default class CareerRequirement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  position: string;

  @Column({ default: null })
  experience: string;

  @Column({ default: null })
  requirement: number;

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
