import { Test, TestingModule } from '@nestjs/testing';
import { IncomePlanController } from './income_plan.controller';
import { IncomePlanService } from './income_plan.service';

describe('IncomePlanController', () => {
  let controller: IncomePlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomePlanController],
      providers: [IncomePlanService],
    }).compile();

    controller = module.get<IncomePlanController>(IncomePlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
