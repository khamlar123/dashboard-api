import { IncomeDailyService } from './income-daily.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('IncomeCurrentService', () => {
  let service: IncomeDailyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomeDailyService],
    }).compile();

    service = module.get<IncomeDailyService>(IncomeDailyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
