import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SafePrismaService } from '../data/prisma.safe';
import { UserRepository } from '../data/repositories/user.repository';
import { PaymentRepository } from '../data/repositories/payment.repository';
import { AuthUseCase } from './auth.usecase';
import { PaymentsUseCase } from './payments.usecase';

@Module({
  imports: [JwtModule.register({})],
  providers: [SafePrismaService, UserRepository, PaymentRepository, AuthUseCase, PaymentsUseCase],
  exports: [AuthUseCase, PaymentsUseCase, UserRepository, PaymentRepository, SafePrismaService],
})
export class DomainModule {}
