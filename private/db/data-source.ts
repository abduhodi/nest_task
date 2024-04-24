import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config({ path: '.env' });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: String(process.env.TYPEORM_PASSWORD),
  database: process.env.TYPEORM_DATABASE,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [process.env.TYPEORM_MIGRATIONS],
  synchronize: false,
  migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
