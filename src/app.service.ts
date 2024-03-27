import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface DatabaseConfig {
  host: string;
  port: number;
}

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  // get an environment variable
  port = this.configService.get<number>('PORT');

  // get a custom configuration value
  db = this.configService.get<DatabaseConfig>('database');

  getHello(): any {
    return {
      appPort: this.port,
      dbHost: this.db.host,
    };
  }
}
