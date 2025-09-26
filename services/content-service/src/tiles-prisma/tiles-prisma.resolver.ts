
import { UseGuards } from '@nestjs/common';
import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { TilesPrismaService } from './tiles-prisma.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';
import { PreviewGuard } from '../security/preview.guard';
import { Roles } from '../security/roles.decorator';
import { RolesGuard } from '../security/roles.guard';
import { AdminGuard } from './tiles.guard';

@ObjectType()
class TileDTO {
  @Field() id: string;
  @Field() page: string;
  @Field() type: string;
  @Field({ nullable: true }) variant?: string;
  @Field({ nullable: true }) weight?: number;
  @Field({ nullable: true }) variant?: string;
  @Field({ nullable: true }) weight?: number;
  @Field() state: string;
  @Field() createdBy: string;
  @Field() updatedBy: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field(() => String) data: any; // JSON as string in schema-less GraphQL; client can JSON.parse
}

@ObjectType()
class TileVersionDTO {
  @Field() id: string;
  @Field() tileId: string;
  @Field() version: number;
  @Field() state: string;
  @Field(() => String) data: any;
  @Field() authorId: string;
  @Field() createdAt: Date;
}

@InputType()
class UpsertTileInput {
  @Field({ nullable: true }) id?: string;
  @Field() page: string;
  @Field({ nullable: true }) order?: number;
  @Field() type: string;
  @Field({ nullable: true }) variant?: string;
  @Field({ nullable: true }) weight?: number;
  @Field({ nullable: true }) variant?: string;
  @Field({ nullable: true }) weight?: number;
  @Field({ nullable: true }) state?: string;
  @Field(() => String) data: any;
  @Field() actorId: string;
}

@Resolver()
export class TilesPrismaResolver {
  constructor(private readonly svc: TilesPrismaService){}

  @UseInterceptors(CacheInterceptor)
  @Query(() => [TileDTO])
  tiles(@Args('page', { nullable: true }) page?: string, @Args('includeDraft', { nullable: true }) includeDraft?: boolean){
    return this.svc.list(page);
  }

  @Query(() => [TileVersionDTO])
  tileHistory(@Args('tileId') tileId: string){
    return this.svc.history(tileId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin','editor')
  @Mutation(() => TileDTO)
  upsertTile(@Args('input') input: UpsertTileInput){
    // input.data is stringified JSON at GraphQL edge; allow string or object
    try { if (typeof input.data === 'string') input.data = JSON.parse(input.data as any); } catch {}
    return this.svc.upsert(input as any);
  }

  @UseGuards(RolesGuard)
  @Roles('admin','editor')
  @Mutation(() => TileDTO)
  publishTile(@Args('tileId') tileId: string, @Args('actorId') actorId: string){
    return this.svc.publish(tileId, actorId);
  }
}
