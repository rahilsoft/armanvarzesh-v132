import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { AssessmentService } from './assessment.service';
import { TestType } from './entities/test.entity';
import { TestResultType } from './entities/test-result.entity';
import { CreateTestInput } from './dto/create-test.input';
import { UpdateTestInput } from './dto/update-test.input';
import { RecordResultInput } from './dto/record-result.input';

@Resolver()
export class AssessmentResolver {
  constructor(private readonly assessmentService: AssessmentService) {}

  // Queries
  @Query(() => [TestType])
  tests() {
    return this.assessmentService.listTests();
  }

  @Query(() => [TestResultType])
  testResultsByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.assessmentService.getResultsByUser(userId);
  }

  // Mutations
  @Mutation(() => TestType)
  createTest(@Args('input') input: CreateTestInput) {
    const { name, description, unit, createdBy } = input;
    return this.assessmentService.createTest(name, description, unit, createdBy);
  }

  @Mutation(() => TestType)
  updateTest(@Args('input') input: UpdateTestInput) {
    const { id, name, description, unit } = input;
    return this.assessmentService.updateTest(id, name, description, unit);
  }

  @Mutation(() => TestType)
  deleteTest(@Args('id', { type: () => Int }) id: number) {
    return this.assessmentService.deleteTest(id);
  }

  @Mutation(() => TestResultType)
  recordTestResult(@Args('input') input: RecordResultInput) {
    const { testId, userId, score } = input;
    return this.assessmentService.recordResult(testId, userId, score);
  }
}