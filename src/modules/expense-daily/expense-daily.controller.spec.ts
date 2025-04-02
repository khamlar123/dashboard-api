import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseDailyController } from './expense-daily.controller';
import { ExpenseDailyService } from './expense-daily.service';

describe('ExpenseDailyController', () => {
  let controller: ExpenseDailyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseDailyController],
      providers: [ExpenseDailyService],
    }).compile();

    controller = module.get<ExpenseDailyController>(ExpenseDailyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
