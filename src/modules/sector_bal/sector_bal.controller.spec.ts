import { Test, TestingModule } from '@nestjs/testing';
import { SectorBalController } from './sector_bal.controller';
import { SectorBalService } from './sector_bal.service';

describe('SectorBalController', () => {
  let controller: SectorBalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectorBalController],
      providers: [SectorBalService],
    }).compile();

    controller = module.get<SectorBalController>(SectorBalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
