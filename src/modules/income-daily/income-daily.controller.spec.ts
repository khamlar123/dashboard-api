import { Test, TestingModule } from '@nestjs/testing';
import { IncomeDailyController } from './income-daily.controller';
import { IncomeDailyService } from './income-daily.service';

describe('IncomeCurrentController', () => {
  let controller: IncomeDailyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeDailyController],
      providers: [IncomeDailyService],
    }).compile();

    controller = module.get<IncomeDailyController>(IncomeDailyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
