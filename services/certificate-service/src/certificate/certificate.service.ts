import * as jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

export class CertificateService {
  async issueCertificate(payload: Record<string, any>) {
    const token = jwt.sign(payload, process.env.CERT_SECRET || 'change_me', { expiresIn: '365d' });
    const url = `${process.env.CERT_VERIFY_URL || 'https://example.com/verify'}?t=${token}`;
    const qrDataUrl = await QRCode.toDataURL(url);
    return { token, qrDataUrl };
  }
  verify(token: string) {
    return jwt.verify(token, process.env.CERT_SECRET || 'change_me');
  }
}
