import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { KpisController } from './kpis.controller';
import { KpisService } from './kpis.service';

const SECRET = 'test-secret-at-least-16-chars';

function bearer(payload: object, secret = SECRET): any {
  return { headers: { authorization: `Bearer ${jwt.sign(payload, secret, { algorithm: 'HS256' })}` } };
}

describe('KpisController', () => {
  let controller: KpisController;
  let service: KpisService;

  const mockKpisService = {
    coachKpis: jest.fn(),
  };

  const mockKpisData = {
    coachId: 123,
    period: { start: new Date('2025-01-01'), end: new Date('2025-01-31') },
    retention30d: 0.86,
    activeTrainees: 128,
    mrr: 7420.0,
    arpu: 58.0,
    sessionsBooked7d: 214,
    churnRate: 0.042,
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = SECRET;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KpisController],
      providers: [{ provide: KpisService, useValue: mockKpisService }],
    }).compile();

    controller = module.get<KpisController>(KpisController);
    service = module.get<KpisService>(KpisService);
    mockKpisService.coachKpis.mockResolvedValue(mockKpisData);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('kpis', () => {
    it('derives the coach id from a verified bearer token', async () => {
      await controller.kpis(bearer({ sub: 123 }));
      expect(service.coachKpis).toHaveBeenCalledWith(123);
    });

    it('returns the KPI payload from the service', async () => {
      await expect(controller.kpis(bearer({ sub: 123 }))).resolves.toEqual(mockKpisData);
    });

    it('accepts userId and id claims as well as sub', async () => {
      await controller.kpis(bearer({ userId: 55 }));
      expect(service.coachKpis).toHaveBeenCalledWith(55);
      await controller.kpis(bearer({ id: 66 }));
      expect(service.coachKpis).toHaveBeenCalledWith(66);
    });

    // Regression guards: each of these once granted access to another
    // coach's KPIs, or to coach 1 with no credentials at all.
    it('rejects a request with no Authorization header', async () => {
      await expect(controller.kpis({ headers: {} })).rejects.toThrow(UnauthorizedException);
      expect(service.coachKpis).not.toHaveBeenCalled();
    });

    it('ignores the x-coach-id header and rejects the request', async () => {
      await expect(controller.kpis({ headers: { 'x-coach-id': '456' } })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.coachKpis).not.toHaveBeenCalled();
    });

    it('does not fall back to coach id 1 when unauthenticated', async () => {
      await expect(controller.kpis({ user: undefined, headers: {} })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.coachKpis).not.toHaveBeenCalled();
    });

    it('ignores an unverified req.user set by an upstream proxy', async () => {
      await expect(controller.kpis({ user: { id: 999 }, headers: {} })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.coachKpis).not.toHaveBeenCalled();
    });

    it('rejects a token signed with the wrong secret', async () => {
      const req = bearer({ sub: 123 }, 'a-different-secret-16-chars');
      await expect(controller.kpis(req)).rejects.toThrow(UnauthorizedException);
      expect(service.coachKpis).not.toHaveBeenCalled();
    });

    it('rejects an unsigned (alg=none) token', async () => {
      const token = jwt.sign({ sub: 123 }, '', { algorithm: 'none' });
      await expect(controller.kpis({ headers: { authorization: `Bearer ${token}` } })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.coachKpis).not.toHaveBeenCalled();
    });

    it('rejects a token carrying a non-positive coach id', async () => {
      await expect(controller.kpis(bearer({ sub: 0 }))).rejects.toThrow(UnauthorizedException);
      await expect(controller.kpis(bearer({ sub: 'abc' }))).rejects.toThrow(UnauthorizedException);
      expect(service.coachKpis).not.toHaveBeenCalled();
    });
  });
});
