import { Injectable } from '@nestjs/common';
@Injectable()
export class RateLimitGuard {
  canActivate(): boolean {
    // Integrated via Nest Throttler globally in AppModule; guard kept for compatibility.
    return true;
  }
}
