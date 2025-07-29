import { Test, TestingModule } from '@nestjs/testing';
import { PaidController } from './paid.controller';
import { PaidService } from './paid.service';

describe('PaidController', () => {
  let controller: PaidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaidController],
      providers: [PaidService],
    }).compile();

    controller = module.get<PaidController>(PaidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
