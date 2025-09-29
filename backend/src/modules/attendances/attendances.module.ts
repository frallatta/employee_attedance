import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  controllers: [AttendancesController],
  providers: [AttendancesService],
  imports: [EmployeesModule, TypeOrmModule.forFeature([Attendance])],
  exports: [AttendancesService],
})
export class AttendancesModule {}
