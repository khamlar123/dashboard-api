import { Test, TestingModule } from '@nestjs/testing';
import { PlAllMonthlyService } from './pl-all-monthly.service';

describe('PlAllMonthlyService', () => {
  let service: PlAllMonthlyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlAllMonthlyService],
    }).compile();

    service = module.get<PlAllMonthlyService>(PlAllMonthlyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
