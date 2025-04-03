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
import { BranchService } from './branch.service';
import { CreateBranchDto } from '../../dto/create-branch.dto';
import { UpdateBranchDto } from '../../dto/update-branch.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    return await this.branchService.create(createBranchDto);
  }

  @Get()
  async findAll() {
    return await this.branchService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.branchService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return await this.branchService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.branchService.remove(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file')) // Multer will handle file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.branchService.importData(file);
  }
}
