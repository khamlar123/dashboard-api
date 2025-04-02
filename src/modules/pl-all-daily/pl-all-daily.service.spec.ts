import { Test, TestingModule } from '@nestjs/testing';
import { PlAllDailyService } from './pl-all-daily.service';

describe('PlAllDailyService', () => {
  let service: PlAllDailyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlAllDailyService],
    }).compile();

    service = module.get<PlAllDailyService>(PlAllDailyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
