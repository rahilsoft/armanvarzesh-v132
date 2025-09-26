import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CorrectiveService } from './corrective.service';
import { CorrectiveExercise } from './entities/exercise.entity';

/**
 * GraphQL resolver for corrective exercise data.  Exposes queries to
 * list all exercises and a mutation to create new exercises.
 */
@Resolver(() => CorrectiveExercise)
export class CorrectiveResolver {
  constructor(private readonly correctiveService: CorrectiveService) {}

  @Query(() => [CorrectiveExercise], { name: 'correctiveExercises' })
  getExercises(): CorrectiveExercise[] {
    return this.correctiveService.findAll();
  }

  @Mutation(() => CorrectiveExercise)
  createCorrectiveExercise(
    @Args('title') title: string,
    @Args('description', { nullable: true }) description?: string,
  ): CorrectiveExercise {
    return this.correctiveService.create({ title, description });
  }
}