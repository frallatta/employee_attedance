import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordEmployeeDto {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;
}
