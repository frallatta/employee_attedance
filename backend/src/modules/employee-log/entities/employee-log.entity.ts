import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'employee_log',
})
export class EmployeeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employee_id: number;

  @Column()
  description: string;

  @Column()
  json_data: string;

  @CreateDateColumn()
  readonly created_at: Date;
}
