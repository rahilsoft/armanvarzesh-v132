import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

/**
 * GraphQL resolver for the users microservice. Exposes CRUD
 * operations for user records. It leverages the UsersService to
 * interact with the Prisma client.
 */
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieve all users from the database.
   */
  @Query(() => [User])
  async users() {
    return this.usersService.findAll();
  }

  /**
   * Fetch a single user by its numeric identifier. Returns null
   * (GraphQL `null`) if the user cannot be found.
   */
  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * Create a new user with the provided input. Returns the newly
   * created user record.
   */
  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }

  /**
   * Update an existing user. If the user does not exist, null
   * is returned. Otherwise, the updated user is returned.
   */
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput
  ) {
    return this.usersService.update(id, input);
  }

  /**
   * Remove a user by id. Returns true if the user existed and was
   * removed. Returns false if no matching record was found.
   */
  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.delete(id);
  }
}