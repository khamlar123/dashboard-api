import { Test, TestingModule } from '@nestjs/testing';
import { SeetorPlanService } from './seetor_plan.service';

describe('SeetorPlanService', () => {
  let service: SeetorPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeetorPlanService],
    }).compile();

    service = module.get<SeetorPlanService>(SeetorPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
