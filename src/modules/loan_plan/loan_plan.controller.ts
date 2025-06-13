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
import { LoanPlanService } from './loan_plan.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('loan-plan')
export class LoanPlanController {
  constructor(private readonly loanPlanService: LoanPlanService) {}

  // @Get()
  // async findAll() {
  //   return await this.loanPlanService.findAll();
  // }
  //
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.loanPlanService.findOne(+id);
  // }
  //
  // @Post('import')
  // @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  // async uploadExcel(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new Error('No file uploaded');
  //   }
  //   return this.loanPlanService.importData(file);
  // }
}
