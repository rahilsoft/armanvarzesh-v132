
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  role?: string;

  // Profile attributes folded from the former users-service.
  @Field(() => Int, { nullable: true })
  age?: number;

  @Field({ nullable: true })
  gender?: string;

  @Field(() => Float, { nullable: true })
  height?: number;

  @Field(() => Float, { nullable: true })
  weight?: number;

  @Field({ nullable: true })
  goals?: string;

  @Field({ nullable: true })
  fitnessLevel?: string;

  @Field()
  createdAt: Date;
}
