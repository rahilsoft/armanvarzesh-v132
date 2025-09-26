import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../src/auth/admin.controller';
import * as jwt from 'jsonwebtoken';

describe('AdminController', () => {
  let controller: AdminController;
  const SECRET = process.env.SECRET || "changeme";
  beforeAll(async () => {
    process.env.ADMIN_JWT_SECRET = SECRET;
    process.env.ADMIN_USERS_JSON = JSON.stringify([{ u:'admin', p:'pass', r:'owner' }]);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
    }).compile();
    controller = module.get<AdminController>(AdminController);
  });

  it('issues token on valid credentials', () => {
    const res: any = controller.login({ username:'admin', password:'pass' });
    expect(res.token).toBeDefined();
    const decoded: any = jwt.verify(res.token, SECRET);
    expect(decoded.sub).toBe('admin');
    expect(decoded.role).toBe('owner');
  });

  it('rejects invalid password', () => {
    expect(() => controller.login({ username:'admin', password:'nope' })).toThrow();
  });
});
