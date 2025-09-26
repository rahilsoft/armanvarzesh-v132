import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * GraphQL representation of a coach. Mirrors the fields defined in
 * the Prisma model for the coaches microservice.
 */
@ObjectType()
export class Coach {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  speciality?: string;

  @Field({ nullable: true })
  certifications?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  verified: boolean;

  @Field()
  createdAt: Date;
}