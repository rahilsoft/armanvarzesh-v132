import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  verify: jest.fn(async (hash: string, plain: string) => plain === 'okpwd'),
  hash: jest.fn(async (plain: string) => 'hashed:' + plain),
}));

const usersMock = {
  findByEmail: jest.fn(async (email: string) => email === 'u@e.com' ? { id: 1, email, password: 'hashed', role: 'user' } : null),
  create: jest.fn(async (data: any) => ({ id: 2, ...data })),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
    jest.spyOn(jwt, 'sign').mockReturnValue('jwt.token');
  });

  it('validateUser returns user on ok credentials', async () => {
    const user = await service.validateUser('u@e.com', 'okpwd');
    expect(user).toBeTruthy();
  });

  it('login returns access token', async () => {
    const res = await service.login({ email: 'u@e.com', password: 'okpwd' } as any);
    expect(res.accessToken).toBe('jwt.token');
  });

  it('register hashes password and returns token', async () => {
    const res = await service.register({ email: 'n@e.com', password: 'newpwd' } as any);
    expect(res.accessToken).toBe('jwt.token');
  });
});