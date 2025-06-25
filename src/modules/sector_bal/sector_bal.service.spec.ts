import { Test, TestingModule } from '@nestjs/testing';
import { SectorBalService } from './sector_bal.service';

describe('SectorBalService', () => {
  let service: SectorBalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectorBalService],
    }).compile();

    service = module.get<SectorBalService>(SectorBalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
