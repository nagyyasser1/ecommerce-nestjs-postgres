import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CategoriesModule } from './modules/categories/categories.module';
import googleConfig from './config/google.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { AttachUserMiddleware } from './common/middlewares/attach-user.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, googleConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: false,
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: false,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    CategoriesModule,
    CloudinaryModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachUserMiddleware).forRoutes('*');
  }
}
