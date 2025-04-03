import { Test, TestingModule } from '@nestjs/testing';
import { IncomeCodeController } from './income_code.controller';
import { IncomeCodeService } from './income_code.service';

describe('IncomeCodeController', () => {
  let controller: IncomeCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeCodeController],
      providers: [IncomeCodeService],
    }).compile();

    controller = module.get<IncomeCodeController>(IncomeCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
