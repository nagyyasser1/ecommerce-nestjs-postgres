import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
  ) {}

  async create(createSizeDto: CreateSizeDto): Promise<Size> {
    const sizeExists = await this.findOneByName(createSizeDto.name);

    if (sizeExists) {
      throw new ConflictException(`Size: ${createSizeDto.name} aready exists!`);
    }
    const newColor = this.sizeRepository.create({ name: createSizeDto.name });
    return await this.sizeRepository.save(newColor);
  }

  async findAll(): Promise<Size[]> {
    return await this.sizeRepository.find();
  }

  async findOneById(id: number): Promise<Size> {
    return await this.sizeRepository.findOneBy({ id });
  }

  async findOneByName(name: string): Promise<Size> {
    return await this.sizeRepository.findOneBy({ name });
  }

  async remove(id: number) {
    return await this.sizeRepository.delete({ id });
  }
}
