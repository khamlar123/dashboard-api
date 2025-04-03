import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TreasureService } from './treasure.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('treasure')
export class TreasureController {
  constructor(private readonly treasureService: TreasureService) {}

  @Get()
  async findAll() {
    return await this.treasureService.findAll();
  }

  @Get('by-month')
  async findByDate(
    @Query('month', new DefaultValuePipe(''))
    month: string,
  ) {
    return await this.treasureService.findByMonth(month);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.treasureService.findOne(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.treasureService.importData(file);
  }
}
