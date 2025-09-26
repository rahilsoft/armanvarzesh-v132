import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) return false;

    const token = auth.replace('Bearer ', '');
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        algorithms: ['HS256'],
        clockTolerance: 5,
      });
      request.user = decoded;
      return true;
    } catch {
      return false;
    }
  }
}