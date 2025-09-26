import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { CourseType } from './entities/course.entity';
import { SessionType } from './entities/session.entity';
import { EnrollmentType } from './entities/enrollment.entity';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { EnrollInput } from './dto/enroll.input';
import { ScheduleSessionInput } from './dto/schedule-session.input';

@Resolver()
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  // Queries
  @Query(() => [CourseType])
  courses() {
    return this.coursesService.listCourses();
  }

  @Query(() => [SessionType])
  sessionsByCourse(@Args('courseId', { type: () => Int }) courseId: number) {
    return this.coursesService.getSessionsByCourse(courseId);
  }

  @Query(() => [EnrollmentType])
  enrollmentsByCourse(@Args('courseId', { type: () => Int }) courseId: number) {
    return this.coursesService.getEnrollmentsByCourse(courseId);
  }

  // Mutations
  @Mutation(() => CourseType)
  createCourse(@Args('input') input: CreateCourseInput) {
    const { title, description, coachId, startDate, endDate } = input;
    return this.coursesService.createCourse(title, description, coachId, startDate, endDate);
  }

  @Mutation(() => CourseType)
  updateCourse(@Args('input') input: UpdateCourseInput) {
    const { id, title, description, coachId, startDate, endDate } = input;
    return this.coursesService.updateCourse(id, title, description, coachId, startDate, endDate);
  }

  @Mutation(() => CourseType)
  deleteCourse(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.deleteCourse(id);
  }

  @Mutation(() => EnrollmentType)
  enrollInCourse(@Args('input') input: EnrollInput) {
    const { courseId, userId } = input;
    return this.coursesService.enrollUser(courseId, userId);
  }

  @Mutation(() => SessionType)
  scheduleSession(@Args('input') input: ScheduleSessionInput) {
    const { courseId, title, date, durationMinutes } = input;
    return this.coursesService.scheduleSession(courseId, title, date, durationMinutes);
  }
}