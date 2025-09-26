
/**
 * Auto-generated e2e test skeleton.
 * TODO: Replace proper module imports for MetricsController.
 */
import {{ Test }} from '@nestjs/testing';
import {{ INestApplication }} from '@nestjs/common';
import * as request from 'supertest';

describe('coaches-service:MetricsController', () => {{
  let app: INestApplication;

  beforeAll(async () => {{
    const moduleRef = await Test.createTestingModule({{
      // TODO: import actual module(s)
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

  // TODO: add real e2e tests for routes under: /
}});
