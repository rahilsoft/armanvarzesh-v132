import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
  ping() {
    return 'pong';
  }
}