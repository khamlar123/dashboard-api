import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseCodeController } from './expense_code.controller';
import { ExpenseCodeService } from './expense_code.service';

describe('ExpenseCodeController', () => {
  let controller: ExpenseCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseCodeController],
      providers: [ExpenseCodeService],
    }).compile();

    controller = module.get<ExpenseCodeController>(ExpenseCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
