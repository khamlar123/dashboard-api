import { Test, TestingModule } from '@nestjs/testing';
import { PlAllMonthlyController } from './pl-all-monthly.controller';
import { PlAllMonthlyService } from './pl-all-monthly.service';

describe('PlAllMonthlyController', () => {
  let controller: PlAllMonthlyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlAllMonthlyController],
      providers: [PlAllMonthlyService],
    }).compile();

    controller = module.get<PlAllMonthlyController>(PlAllMonthlyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
