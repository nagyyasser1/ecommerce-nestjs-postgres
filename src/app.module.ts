import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import cloudinaryConfig from './config/cloudinary.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { AdminsModule } from './admins/admins.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoriesModule } from './categories/categories.module';
import { SizesModule } from './sizes/sizes.module';
import { UploadModule } from './upload/upload.module';
import { ColorModule } from './color/color.module';
import { VariantsModule } from './variants/variants.module';
import googleConfig from './config/google.config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, cloudinaryConfig, googleConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: false,
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
    ClientsModule,
    AdminsModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    CategoriesModule,
    SizesModule,
    UploadModule,
    ColorModule,
    VariantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
