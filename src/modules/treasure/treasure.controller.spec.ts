import { Test, TestingModule } from '@nestjs/testing';
import { TreasureController } from './treasure.controller';
import { TreasureService } from './treasure.service';

describe('TreasureController', () => {
  let controller: TreasureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreasureController],
      providers: [TreasureService],
    }).compile();

    controller = module.get<TreasureController>(TreasureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
