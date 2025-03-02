import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Attraction } from './attraction.entity';
import { CreateAttractionDto } from './create-attraction.dto';
import { AttractionQueryBuilder } from './attraction.query-builder';

@Injectable()
export class AttractionService {
  constructor(
    @InjectRepository(Attraction)
    private attractionRepository: Repository<Attraction>,
  ) {}

  async findAll(params: {
    tags?: number[];
    query?: string;
    page?: number;
    limit?: number;
    orderField?: string;
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<Attraction[]> {
    const queryBuilder = new AttractionQueryBuilder(this.attractionRepository)
      .withTextSearch(params.query)
      .withAllTags(params.tags);

    if (params.orderField) {
      queryBuilder.orderBy(params.orderField, params.orderDirection);
    }

    if (params.page && params.limit) {
      queryBuilder.withPagination(params.page, params.limit);
    }

    return queryBuilder.getResult();
  }

  async findOne(id: number): Promise<Attraction | null> {
    return this.attractionRepository.findOneBy({ id });
  }

  async create(dto: CreateAttractionDto): Promise<void> {
    await this.attractionRepository.save(dto);
  }
}
