import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CoursesService } from '../courses.service';

/**
 * Courses/LMS fold: DB-backed courses/assets/enrollments (former service was
 * an in-memory stub) + certificate issue/verify/revoke (JWT + QR) from
 * certificate-service. Prisma is an in-memory mock; integration/E2E in CI.
 */
function makePrismaMock() {
  const courses: any[] = [];
  const assets: any[] = [];
  const enrollments: any[] = [];
  const certs: any[] = [];
  let seq = 1;
  return {
    _courses: courses, _assets: assets, _enrollments: enrollments, _certs: certs,
    course: {
      create: async ({ data }: any) => { const c = { id: seq++, createdAt: new Date(), ...data }; courses.push(c); return c; },
      findUnique: async ({ where }: any) => courses.find((c) => c.id === where.id) ?? null,
      findMany: async ({ where }: any) => courses.filter((c) => !where?.difficulty || c.difficulty === where.difficulty),
      update: async ({ where, data }: any) => { const c = courses.find((x) => x.id === where.id); Object.assign(c, data); return c; },
      delete: async ({ where }: any) => {
        const i = courses.findIndex((c) => c.id === where.id);
        const [gone] = courses.splice(i, 1);
        for (let j = assets.length - 1; j >= 0; j--) if (assets[j].courseId === gone.id) assets.splice(j, 1);
        for (let j = enrollments.length - 1; j >= 0; j--) if (enrollments[j].courseId === gone.id) enrollments.splice(j, 1);
        return gone;
      },
    },
    courseAsset: {
      create: async ({ data }: any) => { const a = { id: seq++, ...data }; assets.push(a); return a; },
      findMany: async ({ where }: any) => assets.filter((a) => a.courseId === where.courseId).sort((a, b) => a.idx - b.idx),
    },
    courseEnrollment: {
      upsert: async ({ where, create }: any) => {
        const { courseId, userId } = where.courseId_userId;
        let e = enrollments.find((x) => x.courseId === courseId && x.userId === userId);
        if (!e) { e = { id: seq++, enrolledAt: new Date(), ...create }; enrollments.push(e); }
        return e;
      },
      findFirst: async ({ where }: any) => enrollments.find((e) => e.courseId === where.courseId && e.userId === where.userId) ?? null,
      findMany: async ({ where }: any) => enrollments.filter((e) => e.courseId === where.courseId),
    },
    certificate: {
      create: async ({ data }: any) => { const c = { id: seq++, revoked: false, issuedAt: new Date(), ...data }; certs.push(c); return c; },
      findUnique: async ({ where }: any) => certs.find((c) => c.code === where.code) ?? null,
      update: async ({ where, data }: any) => { const c = certs.find((x) => x.code === where.code); Object.assign(c, data); return c; },
    },
  };
}

function make() {
  const prisma = makePrismaMock();
  const svc = new CoursesService(prisma as any);
  return { prisma, svc };
}

describe('CoursesService (Courses/LMS fold)', () => {
  it('creates, filters by difficulty, updates and deletes with cascade', async () => {
    const { prisma, svc } = make();
    const c = await svc.createCourse({ specialistId: 1, title: 'Hypertrophy 101', difficulty: 'beginner', price: 100, duration: 6 });
    await svc.createCourse({ specialistId: 1, title: 'Advanced', difficulty: 'advanced', price: 200, duration: 8 });
    expect(await svc.listCourses('beginner')).toHaveLength(1);
    await svc.updateCourse(c.id, { price: 150 });
    expect(prisma._courses[0].price).toBe(150);
    await svc.addAsset(c.id, 0, 'enc://chunk0', 300);
    await svc.enroll(c.id, 9);
    await svc.deleteCourse(c.id);
    expect(prisma._assets).toHaveLength(0);
    expect(prisma._enrollments).toHaveLength(0);
    await expect(svc.updateCourse(999, {})).rejects.toBeInstanceOf(NotFoundException);
  });

  it('enrollment is idempotent and assets keep order', async () => {
    const { svc } = make();
    const c = await svc.createCourse({ specialistId: 1, title: 'T', price: 0, duration: 1 });
    const e1 = await svc.enroll(c.id, 5);
    const e2 = await svc.enroll(c.id, 5);
    expect(e2.id).toBe(e1.id);
    await svc.addAsset(c.id, 1, 'enc://b', 60);
    await svc.addAsset(c.id, 0, 'enc://a', 60);
    expect((await svc.listAssets(c.id)).map((a) => a.encUrl)).toEqual(['enc://a', 'enc://b']);
  });

  it('issues a certificate only to enrolled users; verify round-trips; revoke invalidates', async () => {
    const { svc } = make();
    const c = await svc.createCourse({ specialistId: 1, title: 'Cert course', price: 0, duration: 1 });
    await expect(svc.issueCertificate(7, c.id)).rejects.toBeInstanceOf(BadRequestException); // not enrolled
    await svc.enroll(c.id, 7);
    const issued = await svc.issueCertificate(7, c.id);
    expect(issued.qrDataUrl).toMatch(/^data:image\/png;base64,/);
    const ok = await svc.verifyCertificate(issued.token);
    expect(ok.valid).toBe(true);
    expect(ok.claims?.sub).toBe('7');
    await svc.revokeCertificate(issued.certificate.code);
    const after = await svc.verifyCertificate(issued.token);
    expect(after.valid).toBe(false);
    expect(after.revoked).toBe(true);
    expect((await svc.verifyCertificate('garbage.token.here')).valid).toBe(false);
  });
});
