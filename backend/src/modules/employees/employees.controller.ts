import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChangePasswordEmployeeDto } from './dto/change-password-employee.dto';
import { UtilsService } from '../utils/utils.service';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeeService: EmployeesService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  async findAll(): Promise<Employee[]> {
    return await this.employeeService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Employee> {
    return await this.findOrFail(id);
  }

  @Post()
  async create(
    @Body() CreateEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    try {
      return this.employeeService.createEmployee(CreateEmployeeDto);
    } catch (e) {
      const message: string = e.detail ?? e.message;
      throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<any> {
    try {
      const employee = await this.findOrFail(id);
      await this.employeeService.updateEmployee(employee, updateEmployeeDto);

      return {
        message: 'Employee data has been updated.',
      };
    } catch (e) {
      const message: string = e.detail ?? e.message;
      throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  @Put(':id/image') // Use @Put decorator for PUT requests
  @UseInterceptors(
    FileInterceptor('file', {
      // 'file' should match the field name in your form-data
      storage: diskStorage({
        destination: './uploads', // Destination folder for uploaded files
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateImageFile(
    @Param('id') id: number, // Get the ID from the URL parameter
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp)$/,
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const employee = await this.findOrFail(id);
    const updateEmployeeDto: UpdateEmployeeDto = {
      image_file_url: `uploads/${file.filename}`,
      is_active: employee.is_active,
    };

    await this.employeeService.updateEmployee(employee, updateEmployeeDto);

    return {
      message: `Upload file image success.`,
    };
  }

  @Put(':id/change-password') // Use @Put decorator for PUT requests
  async changePassword(
    @Param('id') id: number, // Get the ID from the URL parameter
    @Body() changePasswordEmployeeDto: ChangePasswordEmployeeDto,
  ) {
    try {
      const employee = await this.findOrFail(id);
      const isMatchPassword = await this.utilsService.compareHashedText(
        changePasswordEmployeeDto.current_password,
        employee.password,
      );
      if (!isMatchPassword) {
        throw new HttpException(
          'Current password did not match.',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      const updateEmployeeDto: UpdateEmployeeDto = {
        password: changePasswordEmployeeDto.new_password,
      };

      await this.employeeService.updateEmployee(employee, updateEmployeeDto);
      return {
        message: `Password has been changed.`,
      };
    } catch (e) {
      const message: string = e.detail ?? e.message;
      throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  private async findOrFail(id: number): Promise<Employee> {
    const employee = await this.employeeService.findOne(id);
    if (!employee) {
      throw new NotFoundException();
    }

    return employee;
  }
}
