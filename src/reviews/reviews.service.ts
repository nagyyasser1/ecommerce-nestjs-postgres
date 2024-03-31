import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const newReview = this.reviewRepository.create(createReviewDto);

    return await this.reviewRepository.save(newReview);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }

  async findOneById(id: number): Promise<Review> {
    return await this.reviewRepository.findOneBy({ id });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    return await this.reviewRepository.delete({ id });
  }
}
