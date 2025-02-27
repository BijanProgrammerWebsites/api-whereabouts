import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';

import { AttractionService } from './attraction.service';
import { Attraction } from './attraction.entity';
import { CreateAttractionDto } from './create-attraction.dto';

@Controller('attraction')
export class AttractionController {
  constructor(private attractionService: AttractionService) {}

  @Get()
  async findAll(
    @Query(
      'tag',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    tags?: number[],
  ): Promise<Attraction[]> {
    console.log(typeof tags);
    console.log(tags);

    return this.attractionService.findAll(tags ?? []);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Attraction | null> {
    return this.attractionService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateAttractionDto): Promise<void> {
    return this.attractionService.create(dto);
  }
}
