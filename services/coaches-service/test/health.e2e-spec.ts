import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
describe('Health E2E',()=>{ let app:INestApplication; beforeAll(async()=>{ const mod:TestingModule=await Test.createTestingModule({imports:[AppModule]}).compile(); app=mod.createNestApplication(); app.useGlobalPipes(new ValidationPipe({ whitelist:true, transform:true })); await app.init(); }); afterAll(async()=>{ await app.close(); }); it('/health/live', async()=>{ const res=await request(app.getHttpServer()).get('/health/live'); expect(res.status).toBeLessThan(500); }); it('/health/ready', async()=>{ const res=await request(app.getHttpServer()).get('/health/ready'); expect([200,500,503]).toContain(res.status); }); });
