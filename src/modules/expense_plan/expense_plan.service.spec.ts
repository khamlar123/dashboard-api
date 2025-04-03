import { Test, TestingModule } from '@nestjs/testing';
import { ExpensePlanService } from './expense_plan.service';

describe('ExpensePlanService', () => {
  let service: ExpensePlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpensePlanService],
    }).compile();

    service = module.get<ExpensePlanService>(ExpensePlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
