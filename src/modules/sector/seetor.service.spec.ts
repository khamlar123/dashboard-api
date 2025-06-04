import { Test, TestingModule } from '@nestjs/testing';
import { SeetorService } from './seetor.service';

describe('SeetorService', () => {
  let service: SeetorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeetorService],
    }).compile();

    service = module.get<SeetorService>(SeetorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
