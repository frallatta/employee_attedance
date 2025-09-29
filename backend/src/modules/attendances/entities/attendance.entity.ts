import { Employee } from '../../employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(() => Employee, (employee: Employee) => employee.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    type: 'date',
  })
  attendance_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  attendance_in?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  attendance_out?: Date;

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  readonly updated_at: Date;
}
