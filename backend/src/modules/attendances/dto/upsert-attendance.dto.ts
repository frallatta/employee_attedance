import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AttendanceType {
  'IN',
  'OUT',
}

export class UpsertAttendanceDto {
  //   @IsNumber()
  @IsNotEmpty()
  employee_id: number;

  @IsNotEmpty()
  @IsEnum(AttendanceType)
  @Transform(({ value }) => {
    if (value === 'IN') return AttendanceType.IN;
    return AttendanceType.OUT;
  })
  attend_type: AttendanceType;
}
