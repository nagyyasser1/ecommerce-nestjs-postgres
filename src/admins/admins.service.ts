import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminsService {
  constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin | null> {
    const newAdmin = new Admin();
    newAdmin.fname = createAdminDto.fname;
    newAdmin.lname = createAdminDto.lname;
    newAdmin.email = createAdminDto.email;
    newAdmin.password = createAdminDto.password;

    newAdmin.deviceToken = createAdminDto.deviceToken || '';

    try {
      const savedAdmin = await this.adminRepo.save(newAdmin);
      return savedAdmin;
    } catch (error) {
      console.error('Error creating admin:', error);
      return null;
    }
  }

  async findOne(id: number): Promise<Admin | null> {
    try {
      return await this.adminRepo.findOneBy({ id });
    } catch (error) {
      console.log('Error finding Admin', error);
      return null;
    }
  }

  async findAll(): Promise<Admin[]> {
    try {
      return await this.adminRepo.find();
    } catch (error) {
      console.log('Error finding admins: ', error);
    }
  }
}
