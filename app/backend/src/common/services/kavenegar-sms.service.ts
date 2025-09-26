import { Injectable, Logger } from '@nestjs/common';
import type { AxiosError } from 'axios';

// Replace with a real HTTP client later; for now keep shape minimal:
async function httpPost(url: string, data: any, headers?: Record<string, string>): Promise<{ data: any }> {
  const axios = await import('axios');
  const res = await http.default.post(url, data, { headers });
  return { data: res.data };
}

@Injectable()
export class KavenegarSmsService {
  private readonly logger = new Logger(KavenegarSmsService.name);

  async sendVerificationSms(to: string, token: string): Promise<boolean> {
    if (!process.env.KAVENEGAR_API_KEY) {
      this.logger.warn('KAVENEGAR_API_KEY not set, skipping SMS');
      return true;
    }
    try {
      const { data } = await httpPost('https://api.kavenegar.com/v1/'+process.env.KAVENEGAR_API_KEY+'/verify/lookup.json', {
        receptor: to, token, template: process.env.KAVENEGAR_TEMPLATE || 'verify'
      });
      this.logger.log(`Kavenegar response: ${JSON.stringify(data)}`);
      return true;
    } catch (err) {
      const e = err as AxiosError;
      this.logger.error('Kavenegar SMS failed', e?.stack || '');
      return false;
    }
  }
}
