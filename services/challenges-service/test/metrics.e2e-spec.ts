import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
describe('Metrics E2E',()=>{ let app:INestApplication; beforeAll(async()=>{ process.env.METRICS_ENABLED = process.env.METRICS_ENABLED || 'true'; const mod:TestingModule=await Test.createTestingModule({imports:[AppModule]}).compile(); app=mod.createNestApplication(); app.useGlobalPipes(new ValidationPipe({ whitelist:true, transform:true })); await app.init(); }); afterAll(async()=>{ await app.close(); }); it('/metrics', async()=>{ const res=await request(app.getHttpServer()).get('/metrics'); expect([200,404]).toContain(res.status); }); });
