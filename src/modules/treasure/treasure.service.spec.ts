import { Test, TestingModule } from '@nestjs/testing';
import { TreasureService } from './treasure.service';

describe('TreasureService', () => {
  let service: TreasureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreasureService],
    }).compile();

    service = module.get<TreasureService>(TreasureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
