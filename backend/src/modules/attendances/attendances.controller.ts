import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { UpsertAttendanceDto } from './dto/upsert-attendance.dto';
import { EmployeesService } from '../employees/employees.service';

@Controller('attendances')
export class AttendancesController {
  constructor(
    private readonly attendancesService: AttendancesService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post()
  async attend(@Body() upsertAttendanceDto: UpsertAttendanceDto) {
    const employee = await this.employeesService.findOne(
      upsertAttendanceDto.employee_id,
    );

    if (!employee) {
      throw new NotFoundException();
    }

    return this.attendancesService.attend(
      employee,
      upsertAttendanceDto.attend_type,
    );

    // return 'OK';
  }

  @Get()
  findAll(
    @Query('employeeId') employeeId: number,
    @Query('attendanceDate') attendanceDate: string,
  ) {
    console.log(employeeId);
    console.log(attendanceDate);
    return this.attendancesService.findAll();
  }
}
