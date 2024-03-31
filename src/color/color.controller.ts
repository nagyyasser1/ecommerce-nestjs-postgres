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
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/admins/guard/admin.guard';

@ApiTags('color')
@Controller('color')
@UseGuards(AdminGuard)
@UsePipes(ValidationPipe)
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }

  @Get()
  findAll() {
    return this.colorService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.colorService.findOneById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(+id);
  }
}
