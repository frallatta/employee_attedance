import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';
import EmployeeSeeder from '../modules/employees/employee.seeder';
import { Employee } from '../modules/employees/entities/employee.entity';
import { Attendance } from '../modules/attendances/entities/attendance.entity';
// import EmployeeSeeder from './employee/employee.seeder';

config();

(async (): Promise<void> => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    entities: [Employee, Attendance],
    seeds: [EmployeeSeeder],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await runSeeders(dataSource);
})();
