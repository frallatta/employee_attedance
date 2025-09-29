import { Injectable } from '@nestjs/common';
import { AttendanceType } from './dto/upsert-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { Employee } from '../employees/entities/employee.entity';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
// import { format } from 'date-fns';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(filter: FilterAttendanceDto): Promise<Attendance[]> {
    const qb = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee');

    if (filter.employeeId) {
      qb.andWhere('attendance.employee_id = :employee_id', {
        employee_id: filter.employeeId,
      });
    }

    if (filter.attendanceDate) {
      let arrDate = filter.attendanceDate.split('|');
      let startDate = new Date(arrDate[0]);
      let endDate = new Date(arrDate[1]);
      qb.andWhere(
        'attendance.attendance_date BETWEEN :startDate AND :endDate',
        {
          startDate: startDate,
          endDate: endDate,
        },
      );
    }

    return qb.getMany();
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
