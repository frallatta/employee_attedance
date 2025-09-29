import { Injectable } from '@nestjs/common';
import { AttendanceType } from './dto/upsert-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { Employee } from '../employees/entities/employee.entity';
// import { format } from 'date-fns';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private readonly utilsService: UtilsService,
  ) {}

  findAll() {
    return `This action returns all attendances`;
  }

  async attend(employee: Employee, attendanceType: AttendanceType) {
    const currentDateTime = new Date();
    //const currentDate = format(currentDateTime, 'yyyy-MM-dd');
    const attendance = await this.attendanceRepository.findOne({
      relations: {
        employee: true,
      },
      where: {
        attendance_date: currentDateTime,
        employee: {
          id: employee.id,
        },
      },
    });
    console.log(attendance);
    let dataAttendance = {};
    if (attendance) {
      dataAttendance = { ...attendance };
    } else {
      dataAttendance = {
        employee: employee,
        attendance_date: currentDateTime,
      };
    }
    if (attendanceType == AttendanceType.IN) {
      dataAttendance = {
        ...dataAttendance,
        attendance_in: attendance?.attendance_in ?? currentDateTime,
      };
    } else {
      dataAttendance = {
        ...dataAttendance,
        attendance_out: currentDateTime,
      };
    }

    await this.attendanceRepository.save(dataAttendance);

    return `ok`;
  }
}
