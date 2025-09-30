import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UtilsService } from '../utils/utils.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ClientProxy } from '@nestjs/microservices';
import { SendTopicDto } from '../firebase/dto/send-topic.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private readonly utilsService: UtilsService,
    private readonly firebaseService: FirebaseService,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find();
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeesRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<Employee | null> {
    return this.employeesRepository.findOneBy({ email });
  }

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    try {
      if (createEmployeeDto.password) {
        const hashedPassword = await this.utilsService.hashTextData(
          createEmployeeDto.password,
        );
        createEmployeeDto.password = hashedPassword;
      }
      const employee = await this.employeesRepository.save(createEmployeeDto);
      return employee;
    } catch (e) {
      const message: string = e.detail ?? e.message;
      throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  async updateEmployee(
    employee: Employee,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      if (updateEmployeeDto.password) {
        const hashedPassword = await this.utilsService.hashTextData(
          updateEmployeeDto.password,
        );
        updateEmployeeDto.password = hashedPassword;
      }

      const updateEmployee = { ...employee, ...updateEmployeeDto };
      const updatedEmployee =
        await this.employeesRepository.save(updateEmployee);

      if (updateEmployeeDto.is_employee_request) {
        const changeData: string[] = [];
        if (updateEmployeeDto.image_file_url) {
          changeData.push('Image');
        }
        if (updateEmployeeDto.phone_number) {
          changeData.push('Phone Number');
        }
        if (updateEmployeeDto.password) {
          changeData.push('Password');
        }

        const sendTopicDto: SendTopicDto = {
          title: 'Employee Data Change',
          body: `${employee.full_name} has change ${changeData.join(',')} data .`,
          topic: 'emp_update_data',
        };

        await this.firebaseService.sendNotificationToTopic(sendTopicDto);
        this.client.emit('update_employee', employee);
      }

      return updatedEmployee;
    } catch (e) {
      const message: string = e.detail ?? e.message;
      throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  // async changePasswordEmployee(
  //   employee: Employee,
  //   changePasswordEmployeeDto: ChangePasswordEmployeeDto,
  // ): Promise<void> {
  //   try {
  //     const isMatchPassword = this.utilsService.compareHashedText(
  //       changePasswordEmployeeDto.current_password,
  //       employee.password,
  //     );
  //     if (!isMatchPassword) {
  //       throw new HttpException(
  //         'Current password did not match.',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const hashedNewPassword = await this.utilsService.hashTextData(
  //       changePasswordEmployeeDto.new_password,
  //     );

  //     const updateEmployee = { ...employee, password: hashedNewPassword };
  //     await this.employeesRepository.save(updateEmployee);
  //   } catch (e) {
  //     const message = e.detail ?? e.message;
  //     throw new HttpException(message, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
