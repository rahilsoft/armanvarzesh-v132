import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * GraphQL entity representing a chat message exchanged between two users. Each
 * message contains the IDs of the sender and receiver, a text body and the
 * timestamp when it was created.
 */
@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  senderId: number;

  @Field(() => Int)
  receiverId: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;
}
@Field({ nullable: true }) attachmentId?: number;
@Field({ nullable: true }) attachmentUrl?: string; // resolved at query via signed URL
@Field({ nullable: true }) attachmentType?: string;
