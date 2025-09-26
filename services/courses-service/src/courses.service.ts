
import { Injectable } from '@nestjs/common';
import { PrismaClient, Difficulty } from '@prisma/client';
import CryptoJS from 'crypto-js';

@Injectable()
export class CoursesService {
  private prisma = new PrismaClient();

  async manifest(courseId: number) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId }, include: { assets: { orderBy: { idx: 'asc' } } } });
    if (!course) return { ok: false, error: 'not_found' };
    return { ok: true, course: { id: course.id, title: course.title, difficulty: course.difficulty }, assets: course.assets };
  }

  async license(courseId: number, userId: number, deviceId: string) {
    const secret = process.env.LICENSE_SECRET || 'dev-license';
    const payload = JSON.stringify({ courseId, userId, deviceId, ts: Date.now() });
    const token = CryptoJS.HmacSHA256(payload, secret).toString();
    return { ok: true, token };
  }

  async certificateQr(certId: number) {
    const cert = await this.prisma.certificate.findUnique({ where: { id: certId } });
    if (!cert) return { ok: false, error: 'not_found' };
    // Typically we'd return a QR image; here we return a token string that RN QR component can render.
    return { ok: true, qr: `AV_CERT:${cert.qrToken}` };
  }

  async certificateInfo(certId: number) {
    const cert = await this.prisma.certificate.findUnique({ where: { id: certId }, include: { course: true } });
    if (!cert) return { ok: false, error: 'not_found' };
    return { ok: true, certificate: { id: cert.id, code: cert.code, issuedAt: cert.issuedAt, course: { id: cert.course.id, title: cert.course.title } } };
  }
}
