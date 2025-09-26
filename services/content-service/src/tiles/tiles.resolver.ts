
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TilesService } from './tiles.service';
import { Tile } from './entities/tile.entity';

@Resolver()
export class TilesResolver {
  constructor(private readonly service: TilesService){}

  @Query(() => [Tile])
  vitrineTiles(){
    return this.service.readAll();
  }

  @Mutation(() => Boolean)
  putVitrineTiles(@Args('tilesJson', { type: () => String }) tilesJson: string){
    const body = JSON.parse(tilesJson);
    if (!Array.isArray(body.tiles) && !Array.isArray(body?.tiles)){
      // allow either {tiles:[]} or [] as root (normalize)
      if (Array.isArray(body)) return this.service.writeAll({ tiles: body, version: 1, page: 'home', updatedAt: new Date().toISOString() });
      throw new Error('tilesJson must be an array or object with tiles array');
    }
    return this.service.writeAll(body);
  }
}
