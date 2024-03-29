import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminsService {
  constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin | null> {
    const adminCount = await this.adminRepo.count();

    if (adminCount > 0) {
      throw new BadRequestException(
        'there are aready existing admin, contact with him!',
      );
    }

    const existingAdmin = await this.findOneByEmail(createAdminDto.email);

    if (existingAdmin) {
      throw new ConflictException(
        `email: ${createAdminDto.email}, aready exists!`,
      );
    }

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

  async findOneById(id: number): Promise<Admin | undefined> {
    try {
      return await this.adminRepo.findOneBy({ id });
    } catch (error) {
      console.log('Error finding Admin', error);
      return undefined;
    }
  }

  async findOneByEmail(email: string): Promise<Admin | undefined> {
    try {
      return await this.adminRepo.findOneBy({ email });
    } catch (error) {
      console.log('Error finding Admin', error);
      return undefined;
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
