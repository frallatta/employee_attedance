import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => {
    return value.toLowerCase();
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  job_position: string;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === 1 || value === '1') return true;
    if (value === 'false' || value === 0 || value === '0') return false;
    return value; // Return original value if it's not a recognized boolean string/number
  })
  is_admin: boolean;
}
