import { Test, TestingModule } from '@nestjs/testing';
import { IncomeMonthlyController } from './income-monthly.controller';
import { IncomeMonthlyService } from './income-monthly.service';

describe('IncomeMonthlyController', () => {
  let controller: IncomeMonthlyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeMonthlyController],
      providers: [IncomeMonthlyService],
    }).compile();

    controller = module.get<IncomeMonthlyController>(IncomeMonthlyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
