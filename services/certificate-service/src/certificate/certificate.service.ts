import * as jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import { certSecret } from '../config/secret';

export class CertificateService {
  async issueCertificate(payload: Record<string, any>) {
    const token = jwt.sign(payload, certSecret(), { expiresIn: '365d', algorithm: 'HS256' });
    const url = `${process.env.CERT_VERIFY_URL || 'https://example.com/verify'}?t=${token}`;
    const qrDataUrl = await QRCode.toDataURL(url);
    return { token, qrDataUrl };
  }
  verify(token: string) {
    return jwt.verify(token, certSecret(), { algorithms: ['HS256'] });
  }
}
