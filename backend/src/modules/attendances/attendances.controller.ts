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
import { FilterAttendanceDto } from './dto/filter-attendance.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(
    private readonly attendancesService: AttendancesService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post()
  async attend(@Body() upsertAttendanceDto: UpsertAttendanceDto): Promise<any> {
    const employee = await this.employeesService.findOne(
      upsertAttendanceDto.employee_id,
    );

    if (!employee) {
      throw new NotFoundException();
    }

    await this.attendancesService.attend(
      employee,
      upsertAttendanceDto.attend_type,
    );

    return {
      message: 'Attendance data has been saved.',
    };
  }

  @Get()
  findAll(@Query() filter: FilterAttendanceDto) {
    return this.attendancesService.findAll(filter);
  }
}
