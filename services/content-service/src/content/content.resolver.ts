import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { ContentItemType } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';

@Resolver()
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query(() => [ContentItemType])
  contentLibrary() {
    return this.contentService.listItems();
  }

  @Mutation(() => ContentItemType)
  createContentItem(@Args('input') input: CreateContentInput) {
    const { title, description, url, type, createdBy } = input;
    return this.contentService.createItem(title, description, url, type, createdBy);
  }

  @Mutation(() => ContentItemType)
  updateContentItem(@Args('input') input: UpdateContentInput) {
    const { id, title, description, url, type } = input;
    return this.contentService.updateItem(id, title, description, url, type);
  }

  @Mutation(() => ContentItemType)
  deleteContentItem(@Args('id', { type: () => Int }) id: number) {
    return this.contentService.deleteItem(id);
  }
}