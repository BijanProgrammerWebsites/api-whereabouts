import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Attraction } from './attraction.entity';
import { CreateAttractionDto } from './create-attraction.dto';

@Injectable()
export class AttractionService {
  constructor(
    @InjectRepository(Attraction)
    private usersRepository: Repository<Attraction>,
  ) {}

  findAll(): Promise<Attraction[]> {
    return this.usersRepository.find({ relations: { tags: true } });
  }

  findOne(id: number): Promise<Attraction | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(dto: CreateAttractionDto): Promise<void> {
    await this.usersRepository.save(dto);
  }
}
