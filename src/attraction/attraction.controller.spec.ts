import { Test, TestingModule } from '@nestjs/testing';
import { AttractionController } from './attraction.controller';

describe('AttractionController', () => {
  let controller: AttractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractionController],
    }).compile();

    controller = module.get<AttractionController>(AttractionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
