
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Localized {
  @Field({ nullable: true }) fa?: string;
  @Field({ nullable: true }) en?: string;
}

@ObjectType()
export class Media {
  @Field() kind: string; // image|video|lottie
  @Field() src: string;
  @Field(() => Localized, { nullable: true }) alt?: Localized;
}

@ObjectType()
export class Animation {
  @Field({ nullable: true }) trigger?: string; // scroll|hover|click
  @Field({ nullable: true }) effect?: string;  // fade-up|zoom-in
  @Field({ nullable: true }) durationMs?: number;
}

@ObjectType()
export class Cta {
  @Field(() => Localized) label: Localized;
  @Field() href: string;
}

@ObjectType()
export class Tile {
  @Field() id: string;
  @Field() type: string; // showcase
  @Field(() => Localized) title: Localized;
  @Field(() => Localized) subtitle: Localized;
  @Field(() => Cta) cta: Cta;
  @Field(() => Media) media: Media;
  @Field(() => Animation, { nullable: true }) animation?: Animation;
  @Field({ nullable: true }) metricsKey?: string;
}
