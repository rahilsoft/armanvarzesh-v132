
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ExperimentsService } from './experiments.service';
import { Experiment } from './entities/experiment.entity';
import { ExperimentInput } from './dto/experiment.input';

@Resolver(() => Experiment)
export class ExperimentsResolver {
  constructor(private readonly experimentsService: ExperimentsService) {}

  @Query(() => [Experiment])
  async experiments() {
    return this.experimentsService.findAll();
  }

  @Query(() => Experiment, { nullable: true })
  async experiment(@Args('id', { type: () => Int }) id: number) {
    return this.experimentsService.findOne(id);
  }

  @Mutation(() => Experiment)
  async createExperiment(@Args('input') input: ExperimentInput) {
    return this.experimentsService.create(input);
  }

  /**
   * Update an experiment. Returns the updated experiment.
   */
  @Mutation(() => Experiment)
  async updateExperiment(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: ExperimentInput
  ) {
    return this.experimentsService.update(id, input);
  }

  /**
   * Delete an experiment by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteExperiment(@Args('id', { type: () => Int }) id: number) {
    return this.experimentsService.delete(id);
  }
}
