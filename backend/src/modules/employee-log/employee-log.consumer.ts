import { Controller } from '@nestjs/common';
import { EmployeeLogService } from './employee-log.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateEmployeeLogDto } from './dto/create-employee-log.dto';

@Controller()
export class EmployeeLogConsumer {
  constructor(private readonly employeeLogService: EmployeeLogService) {}

  @EventPattern('update_employee')
  async handleEmployeeAdded(@Payload() data: any) {
    const createEmployeeLogDto: CreateEmployeeLogDto = {
      description: 'Employee Update Data',
      employee_id: data.id,
      json_data: JSON.stringify(data),
    };
    await this.employeeLogService.createEmployeeLog(createEmployeeLogDto);
    console.log('📩 Event received:', data);
  }
}
