import { Test, TestingModule } from '@nestjs/testing';
import { IncomeCodeService } from './income_code.service';

describe('IncomeCodeService', () => {
  let service: IncomeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomeCodeService],
    }).compile();

    service = module.get<IncomeCodeService>(IncomeCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
