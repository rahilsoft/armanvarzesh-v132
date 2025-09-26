
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PayrollService } from './payroll.service';
import { Payroll } from './entities/payroll.entity';
import { PayrollInput } from './dto/payroll.input';

@Resolver(() => Payroll)
export class PayrollResolver {
  constructor(private readonly payrollService: PayrollService) {}

  @Query(() => [Payroll])
  async payrolls() {
    return this.payrollService.findAll();
  }

  @Query(() => Payroll, { nullable: true })
  async payroll(@Args('id', { type: () => Int }) id: number) {
    return this.payrollService.findOne(id);
  }

  @Mutation(() => Payroll)
  async createPayroll(@Args('input') input: PayrollInput) {
    return this.payrollService.create(input);
  }

  /**
   * Update an existing payroll entry. Returns the updated record.
   */
  @Mutation(() => Payroll)
  async updatePayroll(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: PayrollInput
  ) {
    return this.payrollService.update(id, input);
  }

  /**
   * Delete a payroll entry by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deletePayroll(@Args('id', { type: () => Int }) id: number) {
    return this.payrollService.delete(id);
  }
}
