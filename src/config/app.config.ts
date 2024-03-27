import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
}));
