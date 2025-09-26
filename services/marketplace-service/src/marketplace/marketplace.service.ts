import { Injectable } from '@nestjs/common';

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  type: string;
  createdBy: number;
  createdAt: Date;
}

export interface Purchase {
  id: number;
  itemId: number;
  userId: number;
  price: number;
  purchasedAt: Date;
}

/**
 * MarketplaceService manages an in-memory list of items and purchases. It allows
 * creating, updating, deleting and listing items as well as purchasing items
 * by users. In production, persistent storage and integration with a payment
 * gateway would be required.
 */
@Injectable()
export class MarketplaceService {
  private items: Item[] = [];
  private purchases: Purchase[] = [];
  private itemIdCounter = 1;
  private purchaseIdCounter = 1;

  createItem(title: string, description: string, price: number, type: string, createdBy: number): Item {
    const item: Item = {
      id: this.itemIdCounter++,
      title,
      description,
      price,
      type,
      createdBy,
      createdAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  updateItem(id: number, title?: string, description?: string, price?: number, type?: string): Item {
    const item = this.items.find(i => i.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (type !== undefined) item.type = type;
    return item;
  }

  deleteItem(id: number): Item {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    const [item] = this.items.splice(index, 1);
    return item;
  }

  listItems(): Item[] {
    return this.items;
  }

  purchaseItem(userId: number, itemId: number): Purchase {
    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    const purchase: Purchase = {
      id: this.purchaseIdCounter++,
      itemId,
      userId,
      price: item.price,
      purchasedAt: new Date(),
    };
    this.purchases.push(purchase);
    return purchase;
  }

  getPurchasesByUser(userId: number): Purchase[] {
    return this.purchases.filter(p => p.userId === userId);
  }
}