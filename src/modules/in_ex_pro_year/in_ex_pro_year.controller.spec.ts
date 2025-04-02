import { Test, TestingModule } from '@nestjs/testing';
import { InExProYearController } from './in_ex_pro_year.controller';
import { InExProYearService } from './in_ex_pro_year.service';

describe('InExProYearController', () => {
  let controller: InExProYearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InExProYearController],
      providers: [InExProYearService],
    }).compile();

    controller = module.get<InExProYearController>(InExProYearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
