import { PaymentsController } from '../src/payments/payments.controller';
import { PaymentsService } from '../src/payments/payments.service';
import { ListPaymentsDto } from '../src/payments/dto/list-payments.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('PaymentsController listMine', () => {
  it('throws unauthorized when no user on request', async () => {
    const svc: Partial<PaymentsService> = {
      listByUser: jest.fn(),
    };
    const ctrl = new PaymentsController(svc as PaymentsService);
    const dto = new ListPaymentsDto();
    await expect(ctrl.listMine(dto, {} as any)).rejects.toThrow(UnauthorizedException);
  });

  it('calls listByUser with user from request', async () => {
    const res = { items: [], nextCursor: undefined };
    const listByUser = jest.fn(async () => res);
    const svc: Partial<PaymentsService> = { listByUser };
    const ctrl = new PaymentsController(svc as PaymentsService);
    const dto = new ListPaymentsDto();
    dto.limit = '5';
    dto.cursor = undefined;
    const result = await ctrl.listMine(dto, { user: { sub: '42' } } as any);
    expect(listByUser).toHaveBeenCalledWith({ userId: '42', limit: 5, cursor: undefined });
    expect(result).toEqual({ ok: true, data: res.items, nextCursor: res.nextCursor });
  });
});