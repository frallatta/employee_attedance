import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { UtilsService } from '../utils/utils.service';

export default class EmployeeSeeder implements Seeder {
  //   constructor(private readonly utilsService: UtilsService) {}
  public async run(
    dataSource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const utilsService = new UtilsService();

    // await dataSource.query('TRUNCATE "employee" RESTART IDENTITY;');

    const hashPassword = await utilsService.hashTextData('12345678');
    const repository = dataSource.getRepository(Employee);
    await repository.insert({
      email: 'usertest@mail.com',
      full_name: 'User Test',
      is_active: true,
      is_admin: true,
      job_position: 'TEST',
      password: hashPassword,
      phone_number: '08124252642',
    });
  }
}
