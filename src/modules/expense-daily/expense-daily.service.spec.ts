import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseDailyService } from './expense-daily.service';

describe('ExpenseDailyService', () => {
  let service: ExpenseDailyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenseDailyService],
    }).compile();

    service = module.get<ExpenseDailyService>(ExpenseDailyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
