import { Test, TestingModule } from '@nestjs/testing';
import { PaidService } from './paid.service';

describe('PaidService', () => {
  let service: PaidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaidService],
    }).compile();

    service = module.get<PaidService>(PaidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
