
import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CertificatesController } from './certificates.controller';

@Module({
  controllers: [CoursesController, CertificatesController],
  providers: [CoursesService],
})
export class AppModule {}
