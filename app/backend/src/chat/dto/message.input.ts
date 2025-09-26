import { InputType, Field, Int } from '@nestjs/graphql';

/**
 * GraphQL input type used to send a new chat message. It includes the IDs of
 * both the sender and the receiver along with the message content.
 */
@InputType()
export class SendMessageInput {
  @Field(() => Int)
  senderId: number;

  @Field(() => Int)
  receiverId: number;

  @Field()
  content: string;
}
@InputType()
export class SendAttachmentInput {
  @Field(() => Int) senderId: number;
  @Field(() => Int) receiverId: number;
  @Field() key: string;
  @Field() contentType: string;
}
