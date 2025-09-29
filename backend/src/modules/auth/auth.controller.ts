import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthLoginDto } from './dto/auth-login.dto';
import type { Request } from 'express';
import { EmployeesService } from '../employees/employees.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private employeeService: EmployeesService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.signIn(authLoginDto);
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    const payload = req.user!;
    const employeeId: number = payload.employee_id;
    const employee = await this.employeeService.findOne(employeeId);

    if (!employee) {
      throw new NotFoundException();
    }

    return employee;
  }
}
