import { Module } from '@nestjs/common';
import { DomainModule } from '../lib/domain';
import { AuthController } from './controllers/auth.controller';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  imports: [DomainModule],
  controllers: [AuthController, PaymentsController],
})
export class PresentationModule {}
