import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("footer_section")
export default class FooterSection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  socialIcon: string;

  @Column({ default: null })
  contactInfo: string;

  @Column({ default: null })
  copyRight: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;

}
