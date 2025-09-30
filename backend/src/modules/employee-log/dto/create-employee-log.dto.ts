import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeLogDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }: { value: string }) => {
    return parseInt(value);
  })
  employee_id: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  json_data: string;
}
