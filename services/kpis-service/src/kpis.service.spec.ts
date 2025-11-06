import { Test, TestingModule } from '@nestjs/testing';
import { KpisService } from './kpis.service';

describe('KpisService', () => {
  let service: KpisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KpisService],
    }).compile();

    service = module.get<KpisService>(KpisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('coachKpis', () => {
    it('should return KPIs for a given coach ID', async () => {
      const coachId = 123;
      const result = await service.coachKpis(coachId);

      expect(result).toBeDefined();
      expect(result.coachId).toBe(coachId);
    });

    it('should return all required KPI fields', async () => {
      const result = await service.coachKpis(1);

      expect(result).toHaveProperty('coachId');
      expect(result).toHaveProperty('period');
      expect(result).toHaveProperty('retention30d');
      expect(result).toHaveProperty('activeTrainees');
      expect(result).toHaveProperty('mrr');
      expect(result).toHaveProperty('arpu');
      expect(result).toHaveProperty('sessionsBooked7d');
      expect(result).toHaveProperty('churnRate');
    });

    it('should return valid period with start and end dates', async () => {
      const result = await service.coachKpis(1);

      expect(result.period).toHaveProperty('start');
      expect(result.period).toHaveProperty('end');
      expect(result.period.start).toBeInstanceOf(Date);
      expect(result.period.end).toBeInstanceOf(Date);
    });

    it('should return numeric values for metrics', async () => {
      const result = await service.coachKpis(1);

      expect(typeof result.retention30d).toBe('number');
      expect(typeof result.activeTrainees).toBe('number');
      expect(typeof result.mrr).toBe('number');
      expect(typeof result.arpu).toBe('number');
      expect(typeof result.sessionsBooked7d).toBe('number');
      expect(typeof result.churnRate).toBe('number');
    });

    it('should return positive values for counts and revenue', async () => {
      const result = await service.coachKpis(1);

      expect(result.activeTrainees).toBeGreaterThanOrEqual(0);
      expect(result.mrr).toBeGreaterThanOrEqual(0);
      expect(result.arpu).toBeGreaterThanOrEqual(0);
      expect(result.sessionsBooked7d).toBeGreaterThanOrEqual(0);
    });

    it('should return retention rate between 0 and 1', async () => {
      const result = await service.coachKpis(1);

      expect(result.retention30d).toBeGreaterThanOrEqual(0);
      expect(result.retention30d).toBeLessThanOrEqual(1);
    });

    it('should return churn rate between 0 and 1', async () => {
      const result = await service.coachKpis(1);

      expect(result.churnRate).toBeGreaterThanOrEqual(0);
      expect(result.churnRate).toBeLessThanOrEqual(1);
    });

    it('should handle different coach IDs', async () => {
      const result1 = await service.coachKpis(1);
      const result2 = await service.coachKpis(999);

      expect(result1.coachId).toBe(1);
      expect(result2.coachId).toBe(999);
    });

    it('should set period start to first day of current month', async () => {
      const result = await service.coachKpis(1);
      const now = new Date();
      const expectedStart = new Date(now.getFullYear(), now.getMonth(), 1);

      expect(result.period.start.getFullYear()).toBe(expectedStart.getFullYear());
      expect(result.period.start.getMonth()).toBe(expectedStart.getMonth());
      expect(result.period.start.getDate()).toBe(1);
    });
  });
});
