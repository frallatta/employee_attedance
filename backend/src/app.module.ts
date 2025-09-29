import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { UtilsModule } from './modules/utils/utils.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
    AttendancesModule,
    EmployeesModule,
    UtilsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
