import { Module } from '@nestjs/common';
import { EmployeeLogService } from './employee-log.service';
import { EmployeeLogConsumer } from './employee-log.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeLog } from './entities/employee-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeLog], 'logDB')],
  controllers: [EmployeeLogConsumer],
  providers: [EmployeeLogService],
  exports: [EmployeeLogService],
})
export class EmployeeLogModule {}
