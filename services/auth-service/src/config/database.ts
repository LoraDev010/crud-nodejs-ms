import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { UserEntity } from '../models/user.model';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: env.SQLSERVER_HOST,
  port: env.SQLSERVER_PORT,
  database: env.SQLSERVER_DATABASE,
  username: env.SQLSERVER_USER,
  password: env.SQLSERVER_PASSWORD,
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  entities: [UserEntity],
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});

export async function initDatabase(): Promise<void> {
  const masterSource = new DataSource({
    type: 'mssql',
    host: env.SQLSERVER_HOST,
    port: env.SQLSERVER_PORT,
    database: 'master',
    username: env.SQLSERVER_USER,
    password: env.SQLSERVER_PASSWORD,
    options: { encrypt: true, trustServerCertificate: true },
  });
  await masterSource.initialize();
  await masterSource.query(
    `IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'${env.SQLSERVER_DATABASE}')
     BEGIN CREATE DATABASE [${env.SQLSERVER_DATABASE}]; END`,
  );
  await masterSource.destroy();

  await AppDataSource.initialize();
  console.log('Conexión a SQL Server establecida');
}
