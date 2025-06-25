import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ExpensePlanService } from './expense_plan.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('expense-plan')
export class ExpensePlanController {
  constructor(private readonly expensePlanService: ExpensePlanService) {}

  // @Get()
  // async findAll() {
  //   return await this.expensePlanService.findAll();
  // }
  //
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.expensePlanService.findOne(+id);
  // }
  //
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.expensePlanService.remove(+id);
  // }
  //
  // @Post('import')
  // @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  // async uploadExcel(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new Error('No file uploaded');
  //   }
  //   return this.expensePlanService.importData(file);
  // }
}
