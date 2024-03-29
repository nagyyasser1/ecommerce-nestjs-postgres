import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';

@Module({
  controllers: [SizesController],
  providers: [SizesService],
})
export class SizesModule {}
