
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminInput } from './dto/admin.input';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => [Admin])
  async admins() {
    return this.adminService.findAll();
  }

  @Query(() => Admin, { nullable: true })
  async admin(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.findOne(id);
  }

  /**
   * Create a new admin account. Accepts an AdminInput containing
   * the email and name of the admin to be created.
   */
  @Mutation(() => Admin)
  async createAdmin(@Args('input') input: AdminInput) {
    return this.adminService.create(input);
  }

  /**
   * Update an existing admin by ID. Only the provided fields will be
   * overwritten. Returns the updated admin.
   */
  @Mutation(() => Admin)
  async updateAdmin(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: AdminInput
  ) {
    return this.adminService.update(id, input);
  }

  /**
   * Delete an admin by its ID. Returns true if the admin existed and was removed.
   */
  @Mutation(() => Boolean)
  async deleteAdmin(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.delete(id);
  }
}
