import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CreateAttractionDto } from './dto/create-attraction.dto';
import { FindAllAttractionsDto } from './dto/find-all-attractions.dto';

import { Attraction } from './attraction.entity';
import { AttractionService } from './attraction.service';

@Controller('attraction')
export class AttractionController {
  constructor(private attractionService: AttractionService) {}

  @Get()
  async findAll(@Query() dto: FindAllAttractionsDto): Promise<Attraction[]> {
    return this.attractionService.findAll(dto);
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
