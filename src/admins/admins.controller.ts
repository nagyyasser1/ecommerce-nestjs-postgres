import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }
}
