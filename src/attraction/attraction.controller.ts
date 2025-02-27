import { Body, Controller, Get, Post } from '@nestjs/common';

import { AttractionService } from './attraction.service';
import { Attraction } from './attraction.entity';
import { CreateAttractionDto } from './create-attraction.dto';

@Controller('attraction')
export class AttractionController {
  constructor(private attractionService: AttractionService) {}

  @Get()
  async findAll(): Promise<Attraction[]> {
    return this.attractionService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateAttractionDto): Promise<void> {
    return this.attractionService.create(dto);
  }
}
