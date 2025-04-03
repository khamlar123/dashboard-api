import { Test, TestingModule } from '@nestjs/testing';
import { IncomePlanService } from './income_plan.service';

describe('IncomePlanService', () => {
  let service: IncomePlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomePlanService],
    }).compile();

    service = module.get<IncomePlanService>(IncomePlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
