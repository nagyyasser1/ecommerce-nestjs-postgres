import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
  },
}));
