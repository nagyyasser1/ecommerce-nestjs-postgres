import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Ecommerce Api')
  .setDescription('Api for advanced ecommerce store.')
  .setVersion('1.0')
  .build();
