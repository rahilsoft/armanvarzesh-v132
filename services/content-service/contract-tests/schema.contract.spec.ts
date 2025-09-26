
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppModule } from '../src/app.module';
import { printSchema } from 'graphql';
import * as fs from 'fs';
import * as path from 'path';

describe('GraphQL Schema Contract', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('matches saved SDL snapshot', async () => {
    // GraphQLModule auto generates schema.gql when autoSchemaFile is enabled; ensure AppModule config writes to disk.
    const sdlPath = path.join(process.cwd(), 'src', 'schema.gql');
    const sdl = fs.readFileSync(sdlPath, 'utf-8');
    expect(sdl).toMatchSnapshot();
  });

  afterAll(async () => { await app.close(); });
});
