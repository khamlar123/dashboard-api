import { Test, TestingModule } from '@nestjs/testing';
import { InExProYearService } from './in_ex_pro_year.service';

describe('InExProYearService', () => {
  let service: InExProYearService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InExProYearService],
    }).compile();

    service = module.get<InExProYearService>(InExProYearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
