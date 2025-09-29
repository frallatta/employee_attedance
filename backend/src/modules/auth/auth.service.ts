import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
  ) {}

  async signIn(authLoginDto: AuthLoginDto) {
    const employee = await this.employeesService.findOneByEmail(
      authLoginDto.email,
    );
    if (!employee) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    if (authLoginDto.is_login_admin && !employee.is_admin) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    const isMatched = await this.utilsService.compareHashedText(
      authLoginDto.password,
      employee.password,
    );

    if (!isMatched) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    const payload = {
      employee_id: employee.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      full_name: employee.full_name,
      job_position: employee.job_position,
      email: employee.email,
    };
  }
}
