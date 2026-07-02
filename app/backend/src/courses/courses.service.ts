import { randomBytes } from 'crypto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import { PrismaService } from '../database/prisma.service';
import { Course, CourseAsset, CourseEnrollment, Certificate, Prisma } from '@prisma/client';

/**
 * Courses/LMS — courses with encrypted assets, idempotent enrollments and
 * verifiable certificates (JWT + QR). Folded from services/courses-service
 * (its Prisma schema carried the value; its service was an in-memory stub)
 * and services/certificate-service (issue/verify logic). Certificate signing
 * requires CERT_SECRET in production (the originals fell back to 'change_me').
 */

function certSecret(): string {
  const s = process.env.CERT_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CERT_SECRET must be set to a strong value (>=16 chars) in production');
  }
  return 'dev-only-cert-secret-change-me';
}

export interface IssuedCertificate {
  certificate: Certificate;
  token: string;
  qrDataUrl: string;
}

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  /*** Courses ***/

  createCourse(input: { specialistId: number; title: string; description?: string; summary?: string; difficulty?: string; price: number; duration: number }): Promise<Course> {
    return this.prisma.course.create({ data: input });
  }

  async updateCourse(id: number, input: Partial<{ title: string; description: string; summary: string; difficulty: string; price: number; duration: number }>): Promise<Course> {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('COURSE_NOT_FOUND');
    return this.prisma.course.update({ where: { id }, data: input });
  }

  async deleteCourse(id: number): Promise<Course> {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('COURSE_NOT_FOUND');
    // assets/enrollments cascade at the database (FK onDelete: Cascade)
    return this.prisma.course.delete({ where: { id } });
  }

  listCourses(difficulty?: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: difficulty ? { difficulty } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  /*** Assets ***/

  async addAsset(courseId: number, idx: number, encUrl: string, durationS: number): Promise<CourseAsset> {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('COURSE_NOT_FOUND');
    return this.prisma.courseAsset.create({ data: { courseId, idx, encUrl, durationS } });
  }

  listAssets(courseId: number): Promise<CourseAsset[]> {
    return this.prisma.courseAsset.findMany({ where: { courseId }, orderBy: { idx: 'asc' } });
  }

  /*** Enrollments ***/

  /** Idempotent: re-enrolling returns the existing row. */
  async enroll(courseId: number, userId: number): Promise<CourseEnrollment> {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('COURSE_NOT_FOUND');
    return this.prisma.courseEnrollment.upsert({
      where: { courseId_userId: { courseId, userId } },
      update: {},
      create: { courseId, userId },
    });
  }

  enrollments(courseId: number): Promise<CourseEnrollment[]> {
    return this.prisma.courseEnrollment.findMany({ where: { courseId } });
  }

  /*** Certificates (from certificate-service) ***/

  async issueCertificate(userId: number, courseId: number | null, kind = 'course', payload: Prisma.InputJsonValue = {}): Promise<IssuedCertificate> {
    if (courseId !== null) {
      const enrolled = await this.prisma.courseEnrollment.findFirst({ where: { courseId, userId } });
      if (!enrolled) throw new BadRequestException('NOT_ENROLLED');
    }
    const code = 'C' + randomBytes(6).toString('hex').toUpperCase();
    const token = jwt.sign({ sub: String(userId), courseId, kind, code, ...(<object>payload) }, certSecret(), { expiresIn: '365d' });
    const url = `${process.env.CERT_VERIFY_URL || 'https://example.com/verify'}?t=${token}`;
    const qrDataUrl = await QRCode.toDataURL(url);
    const certificate = await this.prisma.certificate.create({
      data: { userId, courseId, kind, code, qrToken: token, payload },
    });
    return { certificate, token, qrDataUrl };
  }

  /** Verify signature AND revocation state (the original checked only the JWT). */
  async verifyCertificate(token: string): Promise<{ valid: boolean; claims?: jwt.JwtPayload; revoked?: boolean }> {
    let claims: jwt.JwtPayload;
    try {
      claims = jwt.verify(token, certSecret()) as jwt.JwtPayload;
    } catch {
      return { valid: false };
    }
    const row = await this.prisma.certificate.findUnique({ where: { code: String(claims.code ?? '') } });
    if (!row || row.revoked) return { valid: false, claims, revoked: row?.revoked ?? undefined };
    return { valid: true, claims };
  }

  async revokeCertificate(code: string): Promise<Certificate> {
    const row = await this.prisma.certificate.findUnique({ where: { code } });
    if (!row) throw new NotFoundException('CERTIFICATE_NOT_FOUND');
    return this.prisma.certificate.update({ where: { code }, data: { revoked: true } });
  }
}
