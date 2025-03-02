import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Attraction } from './attraction.entity';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { AttractionQueryBuilder } from './attraction.query-builder';
import { FindAllAttractionsDto } from './dto/find-all-attractions.dto';

@Injectable()
export class AttractionService {
  constructor(
    @InjectRepository(Attraction)
    private attractionRepository: Repository<Attraction>,
  ) {}

  private get columns(): (keyof Attraction)[] {
    return this.attractionRepository.metadata.columns.map(
      (column) => column.propertyName,
    ) as (keyof Attraction)[];
  }

  async findAll({
    query,
    tags,
    page,
    limit,
    orderField,
    orderDirection,
  }: FindAllAttractionsDto): Promise<Attraction[]> {
    const queryBuilder = new AttractionQueryBuilder(this.attractionRepository);

    if (query && query.trim().length > 0) {
      queryBuilder.withTextSearch(query.trim());
    }

    if (tags && tags.length > 0) {
      queryBuilder.withAllTags(tags);
    }

    if (orderField) {
      queryBuilder.withOrderBy(orderField, orderDirection);
    }

    if (page || limit) {
      queryBuilder.withPagination(page, limit);
    }

    return queryBuilder.getResult();
  }

  async findOne(id: number): Promise<Attraction | null> {
    return this.attractionRepository.findOne({
      where: { id },
      select: this.columns,
    });
  }

  async create(dto: CreateAttractionDto): Promise<void> {
    await this.attractionRepository.save(dto);
  }
}
