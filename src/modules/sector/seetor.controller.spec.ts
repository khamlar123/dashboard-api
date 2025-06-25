import { Test, TestingModule } from '@nestjs/testing';
import { SeetorController } from './seetor.controller';
import { SeetorService } from './seetor.service';

describe('SeetorController', () => {
  let controller: SeetorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeetorController],
      providers: [SeetorService],
    }).compile();

    controller = module.get<SeetorController>(SeetorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
