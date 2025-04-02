import { Test, TestingModule } from '@nestjs/testing';
import { IncomeMonthlyService } from './income-monthly.service';

describe('IncomeMonthlyService', () => {
  let service: IncomeMonthlyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomeMonthlyService],
    }).compile();

    service = module.get<IncomeMonthlyService>(IncomeMonthlyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
