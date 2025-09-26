import { Injectable } from '@nestjs/common';

@Injectable()
export class AbTestingService {
  private readonly tests: Record<string, string> = {
    'home-banner': 'A',
  };

  getVariant(testKey: string): string {
    return this.tests[testKey] || 'A';
  }
}
