import { Test, TestingModule } from '@nestjs/testing';
import { KpisController } from './kpis.controller';
import { KpisService } from './kpis.service';

describe('KpisController', () => {
  let controller: KpisController;
  let service: KpisService;

  const mockKpisService = {
    coachKpis: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KpisController],
      providers: [
        {
          provide: KpisService,
          useValue: mockKpisService,
        },
      ],
    }).compile();

    controller = module.get<KpisController>(KpisController);
    service = module.get<KpisService>(KpisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('kpis', () => {
    const mockKpisData = {
      coachId: 1,
      period: {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      },
      retention30d: 0.86,
      activeTrainees: 128,
      mrr: 7420.0,
      arpu: 58.0,
      sessionsBooked7d: 214,
      churnRate: 0.042,
    };

    it('should call service with coach ID from request user', async () => {
      const mockReq = {
        user: { id: 123 },
        headers: {},
      };

      mockKpisService.coachKpis.mockResolvedValue(mockKpisData);

      await controller.kpis(mockReq);

      expect(service.coachKpis).toHaveBeenCalledWith(123);
    });

    it('should call service with coach ID from header when no user', async () => {
      const mockReq = {
        user: undefined,
        headers: { 'x-coach-id': '456' },
      };

      mockKpisService.coachKpis.mockResolvedValue(mockKpisData);

      await controller.kpis(mockReq);

      expect(service.coachKpis).toHaveBeenCalledWith(456);
    });

    it('should default to coach ID 1 when no user or header', async () => {
      const mockReq = {
        user: undefined,
        headers: {},
      };

      mockKpisService.coachKpis.mockResolvedValue(mockKpisData);

      await controller.kpis(mockReq);

      expect(service.coachKpis).toHaveBeenCalledWith(1);
    });

    it('should return KPIs data from service', async () => {
      const mockReq = {
        user: { id: 1 },
        headers: {},
      };

      mockKpisService.coachKpis.mockResolvedValue(mockKpisData);

      const result = await controller.kpis(mockReq);

      expect(result).toEqual(mockKpisData);
    });

    it('should handle string coach ID from header', async () => {
      const mockReq = {
        user: undefined,
        headers: { 'x-coach-id': '789' },
      };

      mockKpisService.coachKpis.mockResolvedValue(mockKpisData);

      await controller.kpis(mockReq);

      expect(service.coachKpis).toHaveBeenCalledWith(789);
      expect(typeof 789).toBe('number');
    });

    it('should prioritize user ID over header', async () => {
      const mockReq = {
        user: { id: 100 },
        headers: { 'x-coach-id': '200' },
      };

      mockKpisService.coachKpis.mockResolvedValue(mockKpisData);

      await controller.kpis(mockReq);

      expect(service.coachKpis).toHaveBeenCalledWith(100);
    });
  });
});
