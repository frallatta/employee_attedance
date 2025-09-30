import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterAttendanceDto {
  @IsOptional()
  @IsString()
  attendanceDate: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }: { value: string }) => {
    return parseInt(value);
  })
  employeeId: number;
}
