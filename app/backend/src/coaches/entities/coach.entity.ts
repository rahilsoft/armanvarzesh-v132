
import { ObjectType, Field, ID } from '@nestjs/graphql';

/** Public projection of a coach. Never includes email or other contact/internal fields. */
export interface PublicCoachShape {
  id: number;
  name: string;
  expertise: string;
  speciality?: string | null;
  certifications?: string | null;
  bio?: string | null;
  verified: boolean;
}

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

@ObjectType()
export class PublicCoach {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  expertise: string;

  @Field(() => String, { nullable: true })
  speciality?: string | null;

  @Field(() => String, { nullable: true })
  certifications?: string | null;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field()
  verified: boolean;
}

/** Whitelist mapper: copies only public fields, so new internal columns never leak. */
export function toPublicCoach(c: PublicCoachShape): PublicCoach {
  return {
    id: c.id,
    name: c.name,
    expertise: c.expertise,
    speciality: c.speciality ?? null,
    certifications: c.certifications ?? null,
    bio: c.bio ?? null,
    verified: c.verified,
  };
}
