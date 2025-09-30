import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EmployeeLog } from 'src/modules/employee-log/entities/employee-log.entity';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT') ?? '5432'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  autoLoadEntities: true,
  synchronize: true,
});

export const typeOrmLogConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('LOG_DB_HOST'),
  port: parseInt(configService.get<string>('LOG_DB_PORT') ?? '5432'),
  username: configService.get<string>('LOG_DB_USERNAME'),
  password: configService.get<string>('LOG_DB_PASSWORD'),
  database: configService.get<string>('LOG_DB_DATABASE'),
  name: 'logDB',
  entities: [EmployeeLog],
  synchronize: true,
});
