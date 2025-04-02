import { Module } from '@nestjs/common';
import { InExProYearService } from './in_ex_pro_year.service';
import { InExProYearController } from './in_ex_pro_year.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InExProYear } from 'src/entity/in_ex_pro_year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InExProYear])],
  controllers: [InExProYearController],
  providers: [InExProYearService],
})
export class InExProYearModule {}
