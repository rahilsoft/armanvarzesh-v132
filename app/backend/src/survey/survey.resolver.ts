
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { Survey } from './entities/survey.entity';
import { SurveyInput } from './dto/survey.input';

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(() => [Survey])
  async surveys() {
    return this.surveyService.findAll();
  }

  @Query(() => Survey, { nullable: true })
  async survey(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.findOne(id);
  }

  @Mutation(() => Survey)
  async createSurvey(@Args('input') input: SurveyInput) {
    return this.surveyService.create(input);
  }

  /**
   * Update an existing survey entry. Returns the updated survey.
   */
  @Mutation(() => Survey)
  async updateSurvey(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: SurveyInput
  ) {
    return this.surveyService.update(id, input);
  }

  /**
   * Delete a survey by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteSurvey(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.delete(id);
  }
}
