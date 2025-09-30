import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig, typeOrmLogConfig } from './config/database.config';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { UtilsModule } from './modules/utils/utils.module';
import { AuthModule } from './modules/auth/auth.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { FirebaseAdminModule } from './modules/firebase/firebase-admin.module';
import { RabbitMqModule } from './modules/rabbitmq/rabbitmq.module';
import { EmployeeLogModule } from './modules/employee-log/employee-log.module';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'logDB',
      useFactory: (configService: ConfigService) =>
        typeOrmLogConfig(configService),
    }),
    RabbitMqModule,
    AttendancesModule,
    EmployeesModule,
    UtilsModule,
    AuthModule,
    FirebaseAdminModule,
    FirebaseModule,
    EmployeeLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
