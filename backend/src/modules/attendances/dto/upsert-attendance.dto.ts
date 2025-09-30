import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export enum AttendanceType {
  'IN',
  'OUT',
}

export class UpsertAttendanceDto {
  //   @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }: { value: string }) => {
    return parseInt(value);
  })
  employee_id: number;

  @IsNotEmpty()
  @IsEnum(AttendanceType)
  @Transform(({ value }) => {
    if (value === 'IN') return AttendanceType.IN;
    return AttendanceType.OUT;
  })
  attend_type: AttendanceType;
}
