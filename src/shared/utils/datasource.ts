import { join } from 'path';
import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: `${process.env.DB_PASSWORD}`,
  database: process.env.DB_DATABASE,
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  migrations: [join(__dirname, '/../../', 'database/migrations/**/*{.ts,.js}')],
});
