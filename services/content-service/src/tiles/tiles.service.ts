
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Tile } from './entities/tile.entity';

@Injectable()
export class TilesService {
  private filePath: string;
  constructor(){
    // default to vitrin-site content file if env not given
    this.filePath = process.env.TILES_FILE || path.join(process.cwd(), '..', '..', 'apps', 'vitrin-site', 'content', 'vitrine.tiles.json');
  }

  async readAll(): Promise<Tile[]> {
    try{
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const j = JSON.parse(raw);
      return j?.tiles || [];
    }catch(e){
      return [];
    }
  }

  async writeAll(body: any): Promise<boolean> {
    const json = JSON.stringify(body, null, 2);
    await fs.writeFile(this.filePath, json, 'utf-8');
    return true;
  }
}
