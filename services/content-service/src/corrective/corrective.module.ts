
import { Module } from '@nestjs/common';
import { CorrectiveService } from './corrective.service';
import { CorrectiveResolver } from './corrective.resolver';

@Module({
  providers: [CorrectiveService, CorrectiveResolver],
  exports: [CorrectiveService]
})
export class CorrectiveModule {}
