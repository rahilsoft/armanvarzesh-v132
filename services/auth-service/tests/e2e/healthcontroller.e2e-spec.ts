
/**
 * Auto-generated e2e test skeleton.
 * TODO: Replace proper module imports for HealthController.
 */
import {{ Test }} from '@nestjs/testing';
import {{ INestApplication }} from '@nestjs/common';
import * as request from 'supertest';

describe('auth-service:HealthController', () => {{
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

  // TODO: add real e2e tests for routes under: health
}});
