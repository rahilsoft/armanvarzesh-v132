import { Module } from '@nestjs/common';
import { CorrectiveService } from './corrective.service';
import { CorrectiveResolver } from './corrective.resolver';
import { CorrectiveController } from './corrective.controller';

/**
 * CorrectiveModule defines a small API surface for managing corrective
 * exercise content.  It mirrors the implementation of the root
 * project and uses an in-memory list to store exercises.
 */
@Module({
  providers: [CorrectiveService, CorrectiveResolver],
  controllers: [CorrectiveController],
  exports: [CorrectiveService],
})
export class CorrectiveModule {}