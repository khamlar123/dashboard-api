import { Test, TestingModule } from '@nestjs/testing';
import { SeetorPlanController } from './seetor_plan.controller';
import { SeetorPlanService } from './seetor_plan.service';

describe('SeetorPlanController', () => {
  let controller: SeetorPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeetorPlanController],
      providers: [SeetorPlanService],
    }).compile();

    controller = module.get<SeetorPlanController>(SeetorPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
