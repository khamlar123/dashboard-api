import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeetorService } from './seetor.service';

@Controller('seetor')
export class SeetorController {
  constructor(private readonly seetorService: SeetorService) {}
}
