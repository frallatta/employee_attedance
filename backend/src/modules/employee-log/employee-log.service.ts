import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmployeeLog } from './entities/employee-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeLogDto } from './dto/create-employee-log.dto';

@Injectable()
export class EmployeeLogService {
  constructor(
    @InjectRepository(EmployeeLog, 'logDB')
    private employeeLogRepository: Repository<EmployeeLog>,
  ) {}

  async createEmployeeLog(
    createEmployeeLogDto: CreateEmployeeLogDto,
  ): Promise<void> {
    try {
      await this.employeeLogRepository.save(createEmployeeLogDto);
    } catch (e) {
      const message: string = e.detail ?? e.message;
      throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
    }
  }
}
