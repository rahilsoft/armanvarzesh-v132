import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsInt, IsObject, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Prisma } from '@prisma/client';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Public } from '../common/auth/public.decorator';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';

/** Canonical REST surface for the Courses/LMS domain. User identity comes from
 *  the JWT; the catalog listing and certificate verification are public. */

class CreateCourseDto {
  @IsInt() specialistId!: number;
  @IsString() @MinLength(1) title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() difficulty?: string;
  @IsInt() @Min(0) price!: number;
  @IsInt() @Min(0) duration!: number;
}

class UpdateCourseDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() difficulty?: string;
  @IsOptional() @IsInt() @Min(0) price?: number;
  @IsOptional() @IsInt() @Min(0) duration?: number;
}

class AddAssetDto {
  @IsInt() @Min(0) idx!: number;
  @IsString() @MinLength(1) encUrl!: string;
  @IsInt() @Min(0) durationS!: number;
}

class IssueCertificateDto {
  @IsOptional() @IsInt() courseId?: number;
  @IsOptional() @IsString() kind?: string;
  @IsOptional() @IsObject() payload?: Record<string, unknown>;
}

class VerifyDto { @IsString() @MinLength(10) token!: string; }
class RevokeDto { @IsString() @MinLength(2) code!: string; }

@Controller('courses')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.courses.createCourse(dto);
  }

  @Public()
  @Get()
  list(@Query('difficulty') difficulty?: string) {
    return this.courses.listCourses(difficulty);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.courses.updateCourse(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courses.deleteCourse(id);
  }

  @Post(':id/assets')
  addAsset(@Param('id', ParseIntPipe) id: number, @Body() dto: AddAssetDto) {
    return this.courses.addAsset(id, dto.idx, dto.encUrl, dto.durationS);
  }

  @Get(':id/assets')
  assets(@Param('id', ParseIntPipe) id: number) {
    return this.courses.listAssets(id);
  }

  @Post(':id/enroll')
  enroll(@CurrentUser() user: AuthPrincipal, @Param('id', ParseIntPipe) id: number) {
    return this.courses.enroll(id, user.userId);
  }

  @Get(':id/enrollments')
  enrollments(@Param('id', ParseIntPipe) id: number) {
    return this.courses.enrollments(id);
  }

  @Post('certificates/issue')
  issue(@CurrentUser() user: AuthPrincipal, @Body() dto: IssueCertificateDto) {
    return this.courses.issueCertificate(user.userId, dto.courseId ?? null, dto.kind, dto.payload as Prisma.InputJsonValue | undefined);
  }

  @Public()
  @Post('certificates/verify')
  verify(@Body() dto: VerifyDto) {
    return this.courses.verifyCertificate(dto.token);
  }

  @Post('certificates/revoke')
  revoke(@Body() dto: RevokeDto) {
    return this.courses.revokeCertificate(dto.code);
  }
}
