import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './guard/admin.guard';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('admins')
@Controller('admins')
@UseGuards(AdminGuard)
@UsePipes(ValidationPipe)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.createAdminByAdmin(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOneById(+id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: number, @Body() admin: UpdateAdminDto) {
    return this.adminsService.update(id, admin);
  }
}
