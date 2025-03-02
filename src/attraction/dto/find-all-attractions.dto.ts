import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

import { OrderDirectionEnum } from '../enums/order-direction.enum';

export class FindAllAttractionsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined ? undefined : Array.isArray(value) ? value : [value],
  )
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Expose({ name: 'tag' })
  tags?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  orderField?: string;

  @IsOptional()
  @IsEnum(OrderDirectionEnum)
  orderDirection?: OrderDirectionEnum;
}
