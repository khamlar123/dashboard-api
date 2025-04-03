import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseCodeService } from './expense_code.service';

describe('ExpenseCodeService', () => {
  let service: ExpenseCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenseCodeService],
    }).compile();

    service = module.get<ExpenseCodeService>(ExpenseCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
