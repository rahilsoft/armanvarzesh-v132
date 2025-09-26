import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MarketplaceService } from './marketplace.service';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { PurchaseItemInput } from './dto/purchase-item.input';
import { ItemType } from './entities/item.entity';
import { PurchaseType } from './entities/purchase.entity';

@Resolver()
export class MarketplaceResolver {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Queries
  @Query(() => [ItemType])
  marketplaceItems() {
    return this.marketplaceService.listItems();
  }

  @Query(() => [PurchaseType])
  purchasesByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.marketplaceService.getPurchasesByUser(userId);
  }

  // Mutations
  @Mutation(() => ItemType)
  createMarketplaceItem(@Args('input') input: CreateItemInput) {
    const { title, description, price, type, createdBy } = input;
    return this.marketplaceService.createItem(title, description, price, type, createdBy);
  }

  @Mutation(() => ItemType)
  updateMarketplaceItem(@Args('input') input: UpdateItemInput) {
    const { id, title, description, price, type } = input;
    return this.marketplaceService.updateItem(id, title, description, price, type);
  }

  @Mutation(() => ItemType)
  deleteMarketplaceItem(@Args('id', { type: () => Int }) id: number) {
    return this.marketplaceService.deleteItem(id);
  }

  @Mutation(() => PurchaseType)
  purchaseMarketplaceItem(@Args('input') input: PurchaseItemInput) {
    const { userId, itemId } = input;
    return this.marketplaceService.purchaseItem(userId, itemId);
  }
}