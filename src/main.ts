import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';

interface appConfig {
  port: number;
  cors: {
    origin: string;
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // retrieve application configuration object
  const appConfigObj = configService.get<appConfig>('app');

  // Enable CORS
  app.enableCors({
    origin: appConfigObj.cors.origin,
  });

  // configure swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document);

  // running the server
  await app.listen(appConfigObj.port);

  // log server url
  console.log(`server running via ${await app.getUrl()} url.`);
}
bootstrap();
