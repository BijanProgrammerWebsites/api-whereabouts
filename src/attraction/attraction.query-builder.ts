import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { OrderDirectionEnum } from './enums/order-direction.enum';

import { Attraction } from './attraction.entity';

export class AttractionQueryBuilder {
  private readonly queryBuilder: SelectQueryBuilder<Attraction>;

  constructor(private readonly repository: Repository<Attraction>) {
    this.queryBuilder = this.repository
      .createQueryBuilder('attraction')
      .leftJoinAndSelect('attraction.tags', 'tag');
  }

  public getQueryBuilder(): SelectQueryBuilder<Attraction> {
    return this.queryBuilder;
  }

  public withTextSearch(searchText: string): AttractionQueryBuilder {
    const searchParam = `%${searchText.trim()}%`;

    this.queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('attraction.title LIKE :search')
          .orWhere('attraction.description LIKE :search')
          .orWhere('attraction.phone LIKE :search')
          .orWhere('attraction.url LIKE :search')
          .orWhere('attraction.address LIKE :search');
      }),
      { search: searchParam },
    );

    return this;
  }

  public withAllTags(tagIds: number[]): AttractionQueryBuilder {
    this.queryBuilder
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('filtered_attractions.attraction_id')
          .from((subQb) => {
            return subQb
              .select('attraction.id')
              .from(Attraction, 'attraction')
              .innerJoin('attraction.tags', 'tag')
              .where('tag.id IN (:...tagIds)')
              .groupBy('attraction.id')
              .having('COUNT(DISTINCT tag.id) = :tagCount');
          }, 'filtered_attractions');

        return 'attraction.id IN ' + subQuery.getQuery();
      })
      .setParameters({ tagIds, tagCount: tagIds.length });

    return this;
  }

  public withOrderBy(
    field: string,
    direction: OrderDirectionEnum = OrderDirectionEnum.ASC,
  ): AttractionQueryBuilder {
    this.queryBuilder.orderBy(`attraction.${field}`, direction);

    return this;
  }

  public withPagination(
    page: number = 1,
    limit: number = 10,
  ): AttractionQueryBuilder {
    this.queryBuilder.skip((page - 1) * limit).take(limit);

    return this;
  }

  public async getResult(): Promise<Attraction[]> {
    return this.queryBuilder.getMany();
  }

  public async getResultWithCount(): Promise<[Attraction[], number]> {
    return this.queryBuilder.getManyAndCount();
  }
}
