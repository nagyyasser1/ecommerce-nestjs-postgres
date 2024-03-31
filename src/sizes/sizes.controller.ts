import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SizesService } from './sizes.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/admins/guard/admin.guard';

@ApiTags('size')
@Controller('size')
@UseGuards(AdminGuard)
@UsePipes(ValidationPipe)
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Post()
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizesService.create(createSizeDto);
  }

  @Get()
  findAll() {
    return this.sizesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizesService.findOneById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizesService.remove(+id);
  }
}
