import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

/**
 * Auto-generated e2e test skeleton for GraphQL resolver.
 * TODO: Import GraphQLModule and the module that declares ChallengesResolver.
 */
import {{ Test }} from '@nestjs/testing';
import {{ INestApplication }} from '@nestjs/common';

describe('challenges-service:ChallengesResolver', () => {{
  let app: INestApplication;

  beforeAll(async () => {{
    const moduleRef = await Test.createTestingModule({{
      // TODO: import GraphQLModule.forRoot<ApolloDriverConfig>({{ autoSchemaFile: true }}) and feature modules
    }}).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  }});

  afterAll(async () => {{
    await app.close();
  }});

  it('should be defined', () => {{
    expect(app).toBeDefined();
  }});

  // TODO: add real gql tests for resolver of: Unknown
}});
