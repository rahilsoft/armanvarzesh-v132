
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Coach {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  expertise: string;

  // Profile fields folded from the former coaches-service. Explicit `() =>
  // String` is required because a `string | null` union reflects as Object.
  @Field(() => String, { nullable: true })
  speciality?: string | null;

  @Field(() => String, { nullable: true })
  certifications?: string | null;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field()
  verified: boolean;

  @Field()
  createdAt: Date;
}
