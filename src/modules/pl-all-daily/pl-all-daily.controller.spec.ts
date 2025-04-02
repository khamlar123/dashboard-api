import { Test, TestingModule } from '@nestjs/testing';
import { PlAllDailyController } from './pl-all-daily.controller';
import { PlAllDailyService } from './pl-all-daily.service';

describe('PlAllDailyController', () => {
  let controller: PlAllDailyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlAllDailyController],
      providers: [PlAllDailyService],
    }).compile();

    controller = module.get<PlAllDailyController>(PlAllDailyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
