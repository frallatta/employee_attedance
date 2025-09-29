import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

config();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  // factories: ['src/database/factories/**/*{.ts,.js}'],
};

export default new DataSource(options);
