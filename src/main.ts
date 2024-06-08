import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

interface AppConfig {
  port: number;
  cors: {
    origin: string;
  };
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // retrieve application configuration object
  const appConfigObj = configService.get<AppConfig>('app');

  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable CORS
  app.enableCors({
    origin: appConfigObj.cors.origin,
    credentials: true,
  });

  app.use(cookieParser());

  // configure swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document);

  await app.listen(appConfigObj.port);
  console.log(`server running via ${await app.getUrl()} url.`);
}
bootstrap();
