import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Size])],
  controllers: [SizesController],
  providers: [SizesService],
})
export class SizesModule {}
