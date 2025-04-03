import { Test, TestingModule } from '@nestjs/testing';
import { ExpensePlanController } from './expense_plan.controller';
import { ExpensePlanService } from './expense_plan.service';

describe('ExpensePlanController', () => {
  let controller: ExpensePlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensePlanController],
      providers: [ExpensePlanService],
    }).compile();

    controller = module.get<ExpensePlanController>(ExpensePlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
