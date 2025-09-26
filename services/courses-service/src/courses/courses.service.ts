import { Injectable } from '@nestjs/common';

export interface Course {
  id: number;
  title: string;
  description: string;
  coachId: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface Session {
  id: number;
  courseId: number;
  title: string;
  date: Date;
  durationMinutes: number;
}

export interface Enrollment {
  id: number;
  courseId: number;
  userId: number;
  enrolledAt: Date;
}

/**
 * CoursesService manages courses, sessions and enrollments in memory. It
 * provides CRUD operations for courses, allows scheduling sessions and
 * enrolling users in courses. In production, persistence and more
 * advanced scheduling capabilities would be required.
 */
@Injectable()
export class CoursesService {
  private courses: Course[] = [];
  private sessions: Session[] = [];
  private enrollments: Enrollment[] = [];
  private courseIdCounter = 1;
  private sessionIdCounter = 1;
  private enrollmentIdCounter = 1;

  createCourse(title: string, description: string, coachId: number, startDate: Date, endDate: Date): Course {
    const course: Course = {
      id: this.courseIdCounter++,
      title,
      description,
      coachId,
      startDate,
      endDate,
      createdAt: new Date(),
    };
    this.courses.push(course);
    return course;
  }

  updateCourse(id: number, title?: string, description?: string, coachId?: number, startDate?: Date, endDate?: Date): Course {
    const course = this.courses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (coachId !== undefined) course.coachId = coachId;
    if (startDate !== undefined) course.startDate = startDate;
    if (endDate !== undefined) course.endDate = endDate;
    return course;
  }

  deleteCourse(id: number): Course {
    const idx = this.courses.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Course not found');
    const [removed] = this.courses.splice(idx, 1);
    // Remove associated sessions and enrollments
    this.sessions = this.sessions.filter(s => s.courseId !== id);
    this.enrollments = this.enrollments.filter(e => e.courseId !== id);
    return removed;
  }

  listCourses(): Course[] {
    return this.courses;
  }

  enrollUser(courseId: number, userId: number): Enrollment {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');
    const existing = this.enrollments.find(e => e.courseId === courseId && e.userId === userId);
    if (existing) return existing;
    const enrollment: Enrollment = {
      id: this.enrollmentIdCounter++,
      courseId,
      userId,
      enrolledAt: new Date(),
    };
    this.enrollments.push(enrollment);
    return enrollment;
  }

  scheduleSession(courseId: number, title: string, date: Date, durationMinutes: number): Session {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');
    const session: Session = {
      id: this.sessionIdCounter++,
      courseId,
      title,
      date,
      durationMinutes,
    };
    this.sessions.push(session);
    return session;
  }

  getSessionsByCourse(courseId: number): Session[] {
    return this.sessions.filter(s => s.courseId === courseId);
  }

  getEnrollmentsByCourse(courseId: number): Enrollment[] {
    return this.enrollments.filter(e => e.courseId === courseId);
  }
}