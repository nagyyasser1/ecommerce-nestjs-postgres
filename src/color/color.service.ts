import { ConflictException, Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from './entities/color.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    const colorExists = await this.findOneByName(createColorDto.name);

    if (colorExists) {
      throw new ConflictException(
        `Color: ${createColorDto.name} aready exists!`,
      );
    }
    const newColor = this.colorRepository.create({ name: createColorDto.name });
    return await this.colorRepository.save(newColor);
  }

  async findAll(): Promise<Color[]> {
    return await this.colorRepository.find();
  }

  async findOneById(id: number): Promise<Color> {
    return await this.colorRepository.findOneBy({ id });
  }

  async findOneByName(name: string): Promise<Color> {
    return await this.colorRepository.findOneBy({ name });
  }

  async remove(id: number) {
    return await this.colorRepository.delete({ id });
  }
}
