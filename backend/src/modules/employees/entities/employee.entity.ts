import { Exclude } from 'class-transformer';
import { Attendance } from '../../attendances/entities/attendance.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({})
  phone_number: string;

  @Column()
  full_name: string;

  @Column()
  job_position: string;

  @Column({
    nullable: true,
  })
  image_file_url: string;

  @Column()
  is_admin: boolean;

  @Column({
    nullable: true,
  })
  fcm_token: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Attendance, (attendance: Attendance) => attendance.employee)
  attendances: Attendance[];

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  readonly updated_at: Date;
}
