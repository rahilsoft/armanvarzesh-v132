
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Condition')
export class ConditionType {
  @Field() code!: string;
  @Field() nameFa!: string;
  @Field({ nullable:true }) nameEn?: string;
  @Field({ nullable:true }) description?: string;
}

@ObjectType('CorrectiveVideo')
export class CorrectiveVideoType {
  @Field() id!: string;
  @Field() title!: string;
  @Field() url!: string;
  @Field(() => [String]) conditions!: string[];
  @Field({ nullable:true }) equipment?: string;
  @Field({ nullable:true }) notes?: string;
  @Field() uploadedBy!: string;
  @Field() status!: string;
  @Field() createdAt!: Date;
}
