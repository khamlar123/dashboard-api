import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseMonthlyController } from './expense-monthly.controller';
import { ExpenseMonthlyService } from './expense-monthly.service';

describe('ExpenseMonthlyController', () => {
  let controller: ExpenseMonthlyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseMonthlyController],
      providers: [ExpenseMonthlyService],
    }).compile();

    controller = module.get<ExpenseMonthlyController>(ExpenseMonthlyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
