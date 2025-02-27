import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Attraction } from './attraction.entity';
import { CreateAttractionDto } from './create-attraction.dto';

@Injectable()
export class AttractionService {
  constructor(
    @InjectRepository(Attraction)
    private attractionRepository: Repository<Attraction>,
  ) {}

  async findAll(tags: number[]): Promise<Attraction[]> {
    if (tags.length === 0) {
      return this.attractionRepository.find({ relations: ['tags'] });
    }

    const matchingAttractionIds = await this.attractionRepository
      .createQueryBuilder('attraction')
      .select('attraction.id')
      .innerJoin('attraction.tags', 'tag')
      .where('tag.id IN (:...tags)', { tags })
      .groupBy('attraction.id')
      .having('COUNT(DISTINCT tag.id) = :tagCount', { tagCount: tags.length })
      .getRawMany()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .then((results) => results.map((result) => result.attraction_id));

    if (matchingAttractionIds.length > 0) {
      return this.attractionRepository
        .createQueryBuilder('attraction')
        .leftJoinAndSelect('attraction.tags', 'tag')
        .where('attraction.id IN (:...ids)', { ids: matchingAttractionIds })
        .getMany();
    }

    return [];
  }

  async findOne(id: number): Promise<Attraction | null> {
    return this.attractionRepository.findOneBy({ id });
  }

  async create(dto: CreateAttractionDto): Promise<void> {
    await this.attractionRepository.save(dto);
  }
}
