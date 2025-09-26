import { Injectable } from '@nestjs/common';

export interface ContentItem {
  id: number;
  title: string;
  description: string;
  url: string;
  type: string; // video, podcast, article
  createdBy: number;
  createdAt: Date;
}

/**
 * ContentService manages an in-memory library of educational resources
 * including videos, podcasts and articles. Provides operations to
 * create, update, delete and list content items.
 */
@Injectable()
export class ContentService {
  private items: ContentItem[] = [];
  private idCounter = 1;

  createItem(title: string, description: string, url: string, type: string, createdBy: number): ContentItem {
    const item: ContentItem = {
      id: this.idCounter++,
      title,
      description,
      url,
      type,
      createdBy,
      createdAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  updateItem(id: number, title?: string, description?: string, url?: string, type?: string): ContentItem {
    const item = this.items.find(i => i.id === id);
    if (!item) throw new Error('Content item not found');
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (url !== undefined) item.url = url;
    if (type !== undefined) item.type = type;
    return item;
  }

  deleteItem(id: number): ContentItem {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Content item not found');
    const [item] = this.items.splice(idx, 1);
    return item;
  }

  listItems(): ContentItem[] {
    return this.items;
  }
}