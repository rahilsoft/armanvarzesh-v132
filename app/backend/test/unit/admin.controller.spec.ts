import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../../src/auth/admin.controller';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

describe('AdminController', () => {
  let controller: AdminController;
  const SECRET = process.env.SECRET || "changeme";
  beforeAll(async () => {
    process.env.ADMIN_JWT_SECRET = SECRET;
    process.env.ADMIN_USERS_JSON = JSON.stringify([
      { u:'admin', p:'pass', r:'owner' },
      { u:'hashed', h: bcrypt.hashSync('secret123', 8), r:'support' },
    ]);
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

  it('issues token for a bcrypt-hashed admin with the right password', () => {
    const res: any = controller.login({ username:'hashed', password:'secret123' });
    const decoded: any = jwt.verify(res.token, SECRET);
    expect(decoded.sub).toBe('hashed');
    expect(decoded.role).toBe('support');
  });

  it('rejects a bcrypt-hashed admin with a wrong password', () => {
    expect(() => controller.login({ username:'hashed', password:'secret124' })).toThrow();
  });

  it('rejects an unknown admin', () => {
    expect(() => controller.login({ username:'ghost', password:'pass' })).toThrow();
  });
});
