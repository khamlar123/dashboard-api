import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseMonthlyService } from './expense-monthly.service';

describe('ExpenseMonthlyService', () => {
  let service: ExpenseMonthlyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenseMonthlyService],
    }).compile();

    service = module.get<ExpenseMonthlyService>(ExpenseMonthlyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
