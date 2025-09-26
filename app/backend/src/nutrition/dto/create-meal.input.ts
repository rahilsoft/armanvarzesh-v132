
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMealInput {
  @Field()
  name: string;

  @Field(() => Int)
  kcal: number;

  @Field({ nullable: true })
  macros?: string;

  @Field({ nullable: true })
  date?: Date;
}
