
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SupportService } from './support.service';
import { Support } from './entities/support.entity';
import { SupportInput } from './dto/support.input';

@Resolver(() => Support)
export class SupportResolver {
  constructor(private readonly supportService: SupportService) {}

  @Query(() => [Support])
  async tickets() {
    return this.supportService.findAll();
  }

  @Query(() => Support, { nullable: true })
  async ticket(@Args('id', { type: () => Int }) id: number) {
    return this.supportService.findOne(id);
  }

  @Mutation(() => Support)
  async createTicket(@Args('input') input: SupportInput) {
    return this.supportService.create(input);
  }

  /**
   * Update an existing support ticket. Returns the updated ticket.
   */
  @Mutation(() => Support)
  async updateTicket(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: SupportInput
  ) {
    return this.supportService.update(id, input);
  }

  /**
   * Delete a support ticket by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteTicket(@Args('id', { type: () => Int }) id: number) {
    return this.supportService.delete(id);
  }
}
