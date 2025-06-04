import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { SectorBalService } from './sector_bal.service';

@Controller('sector-bal')
export class SectorBalController {
  constructor(private readonly sectorBalService: SectorBalService) {}

  @Post('import-date')
  async importBydate(
    @Query('start', new DefaultValuePipe(0))
    start: string,
    @Query('end', new DefaultValuePipe(0))
    end: string,
  ) {
    return await this.sectorBalService.importByDate(start, end);
  }
}
