# REST Contract Census

## UNUSED_SERVER_ROUTES (server has, no client usage)

- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:10`
```ts
export class RewardsController {
  constructor(private svc: RewardsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:10`
```ts
export class PhysioController {
  constructor(private svc: PhysioService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:10`
```ts
export class AssessmentsController {
  constructor(private svc: AssessmentsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:10`
```ts
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:10`
```ts
export class BookingController {
  constructor(private svc: BookingService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /workouts/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:31`
```ts
@Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.delete(id);
  }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/presentation/controllers/payments.controller.ts:30`
```ts
amountCents: dto.amountCents,
      currency: dto.currency,
      idempotencyKey: idemKey || dto.idempotencyKey,
    });
  }

  @Get(API_ROUTES.PAYMENTS.ROOT)
  @UseInterceptors(CacheControlInterceptor)
  @cacheControl('private, max-age=15, stale-while-revalidate=30')
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  async list(
    @Headers('x-user-id') userId: string,
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { RewardsService } from './rewards.service'
@Controller()
export class RewardsController {
  constructor(private svc: RewardsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { PhysioService } from './physio.service'
@Controller()
export class PhysioController {
  constructor(private svc: PhysioService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'
@Controller()
export class AssessmentsController {
  constructor(private svc: AssessmentsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
@Controller()
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { BookingService } from './booking.service'
@Controller()
export class BookingController {
  constructor(private svc: BookingService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /.well-known/jwks.json @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/auth/jwks.controller.ts:8`
```ts
import { ConfigService } from '@nestjs/config';
import { signer } from '@arman/auth-kit';

@Controller('.well-known')
export class JwksController {
  constructor(private readonly config: ConfigService) {}
  @Get('jwks.json')
  async getJwks() {
    const kid = process.env.JWT_KID || 'dev-1';
    const alg = (process.env.JWT_ALG as any) || 'RS256';
    const pem = process.env.JWKS_PRIVATE_PEM || '';
    if (!pem) {
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { RewardsService } from './rewards.service'
@Controller()
export class RewardsController {
  constructor(private svc: RewardsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { PhysioService } from './physio.service'
@Controller()
export class PhysioController {
  constructor(private svc: PhysioService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'
@Controller()
export class AssessmentsController {
  constructor(private svc: AssessmentsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
@Controller()
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { BookingService } from './booking.service'
@Controller()
export class BookingController {
  constructor(private svc: BookingService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /admins @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/admin/controllers/admin.controller.ts:10`
```ts
import { Admin } from '../entities/admin.entity';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
```
- GET /admins/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/admin/controllers/admin.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Admin> {
    return this.adminService.findOne(Number(id));
  }
}
```
- GET /auth/me @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/auth.controller.ts:26`
```ts
@Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: any, @Body() dto: RefreshDto) {
    return this.auth.refresh(req.user.sub, dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return { userId: req.user.sub, email: req.user.email };
  }
}
```
- GET /bff-mobile/dashboard @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/bff-mobile/bff-mobile.controller.ts:7`
```ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('bff-mobile')
export class BffMobileController {
  constructor(private prisma: PrismaService) {}
  @Get('dashboard')
  async dashboard(@Query('userId') userId: string) {
    const [workouts, notifications] = await Promise.all([
      (this.prisma as any).workout.findMany({ where: { userId }, take: 3, orderBy: { date: 'desc' } }),
      (this.prisma as any).notification?.findMany?.({ where: { userId }, take: 5, orderBy: { createdAt: 'desc' } }) || []
    ]);
```
- GET /bff-web/home @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/bff-web/bff-web.controller.ts:7`
```ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('bff-web')
export class BffWebController {
  constructor(private prisma: PrismaService) {}
  @Get('home')
  async home(@Query('userId') userId: string) {
    const [user, workouts] = await Promise.all([
      (this.prisma as any).user.findUnique({ where: { id: userId } }),
      (this.prisma as any).workout.findMany({ where: { userId }, take: 5, orderBy: { date: 'desc' } }),
    ]);
```
- GET /bff/dashboard @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/bff/bff.controller.ts:8`
```ts
import { PrismaService } from '../database/prisma.service';

@Controller('bff')
export class BffController {
  constructor(private prisma: PrismaService) {}
  // Aggregate few quick stats for dashboard in one request
  @Get('dashboard')
  async dashboard(@Query('userId') userId: string) {
    const [workouts, upcoming, notifications] = await Promise.all([
      (this.prisma as any).workout.count({ where: { userId } }),
      (this.prisma as any).session?.findMany?.({ where: { userId, date: { gte: new Date() } }, take: 5 }) ?? [],
      (this.prisma as any).notification?.findMany?.({ where: { userId }, take: 5 }) ?? [],
```
- GET /cert/verify @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/certificate/certificate.controller.ts:17`
```ts
@Roles('admin')
  @UseGuards(RolesGuard)
  async issue(@Body() body: any) {
    return this.svc.issueCertificate(body);
  }

  @Get('verify')
  verify(@Query('t') t: string) {
    return this.svc.verify(t);
  }
}
```
- GET /challenges @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/challenges/controllers/challenges.controller.ts:10`
```ts
import { Challenge } from '../entities/challenge.entity';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  async findAll(): Promise<Challenge[]> {
    return this.challengesService.findAll();
  }

  @Get(':id')
```
- GET /challenges/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/challenges/controllers/challenges.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Challenge[]> {
    return this.challengesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Challenge> {
    return this.challengesService.findOne(Number(id));
  }
}
```
- GET /coaches/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/coaches/controllers/coaches.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Coach[]> {
    return this.coachesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Coach> {
    return this.coachesService.findOne(Number(id));
  }
}
```
- GET /contents @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/cms/controllers/cms.controller.ts:10`
```ts
import { Cms } from '../entities/cms.entity';

@Controller('contents')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async findAll(): Promise<Cms[]> {
    return this.cmsService.findAll();
  }

  @Get(':id')
```
- GET /contents/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/cms/controllers/cms.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Cms[]> {
    return this.cmsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Cms> {
    return this.cmsService.findOne(Number(id));
  }
}
```
- GET /corporate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/corporate/controllers/corporate.controller.ts:10`
```ts
import { Corporate } from '../entities/corporate.entity';

@Controller('corporate')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Get()
  async findAll(): Promise<Corporate[]> {
    return this.corporateService.findAll();
  }

  @Get(':id')
```
- GET /corporate/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/corporate/controllers/corporate.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Corporate[]> {
    return this.corporateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Corporate> {
    return this.corporateService.findOne(Number(id));
  }
}
```
- GET /experiments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/experiments/controllers/experiments.controller.ts:10`
```ts
import { Experiment } from '../entities/experiment.entity';

@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) {}

  @Get()
  async findAll(): Promise<Experiment[]> {
    return this.experimentsService.findAll();
  }

  @Get(':id')
```
- GET /experiments/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/experiments/controllers/experiments.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Experiment[]> {
    return this.experimentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Experiment> {
    return this.experimentsService.findOne(Number(id));
  }
}
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/health/health.controller.ts:5`
```ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  ping() {
    return { ok: true, service: 'backend', ts: Date.now() };
  }
}
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/health/health.controller.ts:4`
```ts
import { Controller, Get } from '@nestjs/common';
@Controller('health')
export class HealthController {
  @Get()
  liveness() { return { status: 'ok', ts: Date.now() }; }
}
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```

## UNRESOLVED_CLIENT_CALLS (client calls, no matching server)

- GET /api/coaches @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/coaches/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Coaches() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/coaches').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>coaches</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/coaches @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/coaches/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Coaches() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/coaches').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>coaches</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/courses @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/courses/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>courses</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/courses @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/courses/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>courses</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/marketplace @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/marketplace/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Marketplace() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/marketplace').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>marketplace</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/marketplace @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/marketplace/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Marketplace() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/marketplace').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>marketplace</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/metrics?name= @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/vitrin-site/app/admin/experiments/page.tsx:13`
```ts
<h3 style={{marginTop:0}}>{title}</h3>
    {children}
  </div>;
}

async function fetchMetric(name:string){
  const r = await fetch('/api/metrics?name=' + encodeURIComponent(name));
  const j = await r.json();
  // clickhouse JSON: { data: [...], meta: [...] }
  return j.data || [];
}
```
- GET /api/monitoring @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/monitoring/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>monitoring</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/monitoring @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/monitoring/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>monitoring</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/notifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/notifications/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>notifications</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/notifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/notifications/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>notifications</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/nutrition @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/nutrition/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Nutrition() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/nutrition').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>nutrition</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/nutrition @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/nutrition/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Nutrition() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/nutrition').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>nutrition</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/payments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Payments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/payments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>payments</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/payments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Payments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/payments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>payments</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/physio @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/physio/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>physio</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/physio @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/physio/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>physio</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/rewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/rewards/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>rewards</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/rewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/rewards/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>rewards</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/vip @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/vip/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>vip</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/vip @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/vip/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>vip</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/workouts/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Workouts() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/workouts').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>workouts</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/workouts/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Workouts() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/workouts').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>workouts</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /assessments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/assessments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Assessments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/assessments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>assessments — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /assessments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/assessments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Assessments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/assessments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>assessments — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /booking @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/booking/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Booking() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/booking').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>booking — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /booking @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/booking/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Booking() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/booking').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>booking — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /certificate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/certificate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Certificate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/certificate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>certificate — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /certificate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/certificate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Certificate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/certificate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>certificate — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /chat @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/chat/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Chat() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/chat').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>chat — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /chat @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/chat/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Chat() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/chat').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>chat — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /courses @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/courses/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>courses — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /courses @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/courses/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>courses — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET https://fcm.googleapis.com/fcm/send @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications/notifications.service.ts:42`
```ts
return { id: rec.id };
  }

  async sendPush(dto: {token: string; title: string; body: string; data?: any}) {
    const serverKey = process.env.FCM_SERVER_KEY;
    if (!serverKey) throw new Error('FCM_SERVER_KEY missing');
    const resp = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: { 'Authorization': `key=${serverKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({ to: dto.token, notification: { title: dto.title, body: dto.body }, data: dto.data || {} })
    });
    const j = await resp.json();
```
- GET /monitoring @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/monitoring/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>monitoring — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /monitoring @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/monitoring/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>monitoring — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /notifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/notifications/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>notifications — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /notifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/notifications/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>notifications — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /nutrition @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/nutrition/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Nutrition() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/nutrition').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>nutrition — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /nutrition @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/nutrition/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Nutrition() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/nutrition').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>nutrition — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /physio @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/physio/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>physio — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /physio @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/physio/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>physio — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /rewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/rewards/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>rewards — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /rewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/rewards/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>rewards — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /vip @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/vip/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>vip — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /vip @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/vip/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>vip — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

## FULL MAP (server↔client pairs)

### DELETE /:id — UNUSED_SERVER_ROUTE

**Server**:
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:10`
```ts
export class RewardsController {
  constructor(private svc: RewardsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:10`
```ts
export class PhysioController {
  constructor(private svc: PhysioService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:10`
```ts
export class AssessmentsController {
  constructor(private svc: AssessmentsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:10`
```ts
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- DELETE /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:10`
```ts
export class BookingController {
  constructor(private svc: BookingService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```

---
### DELETE /workouts/:id — UNUSED_SERVER_ROUTE

**Server**:
- DELETE /workouts/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:31`
```ts
@Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.delete(id);
  }
}
```

---
### GET / — UNUSED_SERVER_ROUTE

**Server**:
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/presentation/controllers/payments.controller.ts:30`
```ts
amountCents: dto.amountCents,
      currency: dto.currency,
      idempotencyKey: idemKey || dto.idempotencyKey,
    });
  }

  @Get(API_ROUTES.PAYMENTS.ROOT)
  @UseInterceptors(CacheControlInterceptor)
  @cacheControl('private, max-age=15, stale-while-revalidate=30')
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  async list(
    @Headers('x-user-id') userId: string,
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { RewardsService } from './rewards.service'
@Controller()
export class RewardsController {
  constructor(private svc: RewardsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { PhysioService } from './physio.service'
@Controller()
export class PhysioController {
  constructor(private svc: PhysioService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'
@Controller()
export class AssessmentsController {
  constructor(private svc: AssessmentsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
@Controller()
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:6`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { BookingService } from './booking.service'
@Controller()
export class BookingController {
  constructor(private svc: BookingService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```

---
### GET /.well-known/jwks.json — UNUSED_SERVER_ROUTE

**Server**:
- GET /.well-known/jwks.json @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/auth/jwks.controller.ts:8`
```ts
import { ConfigService } from '@nestjs/config';
import { signer } from '@arman/auth-kit';

@Controller('.well-known')
export class JwksController {
  constructor(private readonly config: ConfigService) {}
  @Get('jwks.json')
  async getJwks() {
    const kid = process.env.JWT_KID || 'dev-1';
    const alg = (process.env.JWT_ALG as any) || 'RS256';
    const pem = process.env.JWKS_PRIVATE_PEM || '';
    if (!pem) {
```

---
### GET /:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { RewardsService } from './rewards.service'
@Controller()
export class RewardsController {
  constructor(private svc: RewardsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { PhysioService } from './physio.service'
@Controller()
export class PhysioController {
  constructor(private svc: PhysioService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'
@Controller()
export class AssessmentsController {
  constructor(private svc: AssessmentsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
@Controller()
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- GET /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:7`
```ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { BookingService } from './booking.service'
@Controller()
export class BookingController {
  constructor(private svc: BookingService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```

---
### GET /admins — UNUSED_SERVER_ROUTE

**Server**:
- GET /admins @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/admin/controllers/admin.controller.ts:10`
```ts
import { Admin } from '../entities/admin.entity';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
```

---
### GET /admins/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /admins/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/admin/controllers/admin.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Admin> {
    return this.adminService.findOne(Number(id));
  }
}
```

---
### GET /affiliate — USED_BY_CLIENT

**Server**:
- GET /affiliate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__affiliate.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /affiliate
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('affiliate')
export class GET__affiliateController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /affiliate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/affiliate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Affiliate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/affiliate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>affiliate — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /affiliate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/affiliate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Affiliate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/affiliate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>affiliate — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /ai — USED_BY_CLIENT

**Server**:
- GET /ai @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__ai.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /ai
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('ai')
export class GET__aiController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /ai @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/ai/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Ai() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/ai').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>ai — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /ai @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/ai/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Ai() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/ai').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>ai — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /analytics — USED_BY_CLIENT

**Server**:
- GET /analytics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__analytics.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /analytics
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('analytics')
export class GET__analyticsController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /analytics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/analytics/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Analytics() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/analytics').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>analytics — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /analytics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/analytics/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Analytics() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/analytics').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>analytics — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/affiliate — USED_BY_CLIENT

**Server**:
- GET /api/affiliate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_affiliate.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /api/affiliate
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('api/affiliate')
export class GET__api_affiliateController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /api/affiliate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/affiliate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Affiliate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/affiliate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>affiliate</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/affiliate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/affiliate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Affiliate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/affiliate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>affiliate</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/ai — USED_BY_CLIENT

**Server**:
- GET /api/ai @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_ai.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /api/ai
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('api/ai')
export class GET__api_aiController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /api/ai @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/ai/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Ai() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/ai').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>ai</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/ai @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/ai/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Ai() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/ai').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>ai</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/analytics — USED_BY_CLIENT

**Server**:
- GET /api/analytics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_analytics.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /api/analytics
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('api/analytics')
export class GET__api_analyticsController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /api/analytics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/analytics/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Analytics() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/analytics').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>analytics</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/analytics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/analytics/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Analytics() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/analytics').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>analytics</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/assessments — USED_BY_CLIENT

**Server**:
- GET /api/assessments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_assessments.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /api/assessments
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('api/assessments')
export class GET__api_assessmentsController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /api/assessments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/assessments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Assessments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/assessments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>assessments</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/assessments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/assessments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Assessments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/assessments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>assessments</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/booking — USED_BY_CLIENT

**Server**:
- GET /api/booking @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_booking.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /api/booking
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('api/booking')
export class GET__api_bookingController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /api/booking @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/booking/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Booking() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/booking').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>booking</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/booking @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/booking/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Booking() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/booking').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>booking</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/certificate — USED_BY_CLIENT

**Server**:
- GET /api/certificate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_certificate.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /api/certificate
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('api/certificate')
export class GET__api_certificateController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /api/certificate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/certificate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Certificate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/certificate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>certificate</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/certificate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/certificate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Certificate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/certificate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>certificate</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/chat — USED_BY_CLIENT

**Server**:
- GET /api/chat @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_chat.controller.ready.ts:6`
```ts
// Stage 14 Ready Controller for REST call: GET /api/chat
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('api/chat')
export class GET__api_chatController {
  @Get()
  handle(){ return { ok: true }; }
}
*/
```
**Client**:
- GET /api/chat @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/chat/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Chat() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/chat').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>chat</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/chat @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/chat/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Chat() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/chat').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>chat</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/coaches — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/coaches @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/coaches/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Coaches() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/coaches').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>coaches</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/coaches @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/coaches/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Coaches() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/coaches').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>coaches</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/courses — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/courses @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/courses/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>courses</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/courses @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/courses/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>courses</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/marketplace — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/marketplace @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/marketplace/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Marketplace() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/marketplace').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>marketplace</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/marketplace @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/marketplace/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Marketplace() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/marketplace').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>marketplace</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/metrics?name= — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/metrics?name= @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/vitrin-site/app/admin/experiments/page.tsx:13`
```ts
<h3 style={{marginTop:0}}>{title}</h3>
    {children}
  </div>;
}

async function fetchMetric(name:string){
  const r = await fetch('/api/metrics?name=' + encodeURIComponent(name));
  const j = await r.json();
  // clickhouse JSON: { data: [...], meta: [...] }
  return j.data || [];
}
```

---
### GET /api/monitoring — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/monitoring @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/monitoring/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>monitoring</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/monitoring @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/monitoring/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>monitoring</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/notifications — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/notifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/notifications/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>notifications</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/notifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/notifications/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>notifications</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/nutrition — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/nutrition @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/nutrition/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Nutrition() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/nutrition').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>nutrition</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/nutrition @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/nutrition/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Nutrition() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/nutrition').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>nutrition</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/payments — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/payments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Payments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/payments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>payments</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/payments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Payments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/payments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>payments</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/physio — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/physio @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/physio/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>physio</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/physio @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/physio/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>physio</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/rewards — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/rewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/rewards/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>rewards</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/rewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/rewards/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>rewards</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/vip — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/vip @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/vip/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>vip</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/vip @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/vip/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>vip</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /api/workouts — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /api/workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/workouts/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Workouts() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/workouts').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>workouts</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /api/workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/workouts/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Workouts() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/workouts').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>workouts</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /assessments — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /assessments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/assessments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Assessments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/assessments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>assessments — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /assessments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/assessments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Assessments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/assessments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>assessments — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /auth/me — UNUSED_SERVER_ROUTE

**Server**:
- GET /auth/me @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/auth.controller.ts:26`
```ts
@Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: any, @Body() dto: RefreshDto) {
    return this.auth.refresh(req.user.sub, dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return { userId: req.user.sub, email: req.user.email };
  }
}
```

---
### GET /bff-mobile/dashboard — UNUSED_SERVER_ROUTE

**Server**:
- GET /bff-mobile/dashboard @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/bff-mobile/bff-mobile.controller.ts:7`
```ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('bff-mobile')
export class BffMobileController {
  constructor(private prisma: PrismaService) {}
  @Get('dashboard')
  async dashboard(@Query('userId') userId: string) {
    const [workouts, notifications] = await Promise.all([
      (this.prisma as any).workout.findMany({ where: { userId }, take: 3, orderBy: { date: 'desc' } }),
      (this.prisma as any).notification?.findMany?.({ where: { userId }, take: 5, orderBy: { createdAt: 'desc' } }) || []
    ]);
```

---
### GET /bff-web/home — UNUSED_SERVER_ROUTE

**Server**:
- GET /bff-web/home @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/bff-web/bff-web.controller.ts:7`
```ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('bff-web')
export class BffWebController {
  constructor(private prisma: PrismaService) {}
  @Get('home')
  async home(@Query('userId') userId: string) {
    const [user, workouts] = await Promise.all([
      (this.prisma as any).user.findUnique({ where: { id: userId } }),
      (this.prisma as any).workout.findMany({ where: { userId }, take: 5, orderBy: { date: 'desc' } }),
    ]);
```

---
### GET /bff/dashboard — UNUSED_SERVER_ROUTE

**Server**:
- GET /bff/dashboard @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/bff/bff.controller.ts:8`
```ts
import { PrismaService } from '../database/prisma.service';

@Controller('bff')
export class BffController {
  constructor(private prisma: PrismaService) {}
  // Aggregate few quick stats for dashboard in one request
  @Get('dashboard')
  async dashboard(@Query('userId') userId: string) {
    const [workouts, upcoming, notifications] = await Promise.all([
      (this.prisma as any).workout.count({ where: { userId } }),
      (this.prisma as any).session?.findMany?.({ where: { userId, date: { gte: new Date() } }, take: 5 }) ?? [],
      (this.prisma as any).notification?.findMany?.({ where: { userId }, take: 5 }) ?? [],
```

---
### GET /booking — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /booking @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/booking/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Booking() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/booking').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>booking — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /booking @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/booking/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Booking() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/booking').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>booking — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /cert/verify — UNUSED_SERVER_ROUTE

**Server**:
- GET /cert/verify @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/certificate/certificate.controller.ts:17`
```ts
@Roles('admin')
  @UseGuards(RolesGuard)
  async issue(@Body() body: any) {
    return this.svc.issueCertificate(body);
  }

  @Get('verify')
  verify(@Query('t') t: string) {
    return this.svc.verify(t);
  }
}
```

---
### GET /certificate — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /certificate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/certificate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Certificate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/certificate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>certificate — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /certificate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/certificate/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Certificate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/certificate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>certificate — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /challenges — UNUSED_SERVER_ROUTE

**Server**:
- GET /challenges @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/challenges/controllers/challenges.controller.ts:10`
```ts
import { Challenge } from '../entities/challenge.entity';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  async findAll(): Promise<Challenge[]> {
    return this.challengesService.findAll();
  }

  @Get(':id')
```

---
### GET /challenges/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /challenges/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/challenges/controllers/challenges.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Challenge[]> {
    return this.challengesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Challenge> {
    return this.challengesService.findOne(Number(id));
  }
}
```

---
### GET /chat — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /chat @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/chat/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Chat() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/chat').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>chat — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /chat @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/chat/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Chat() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/chat').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>chat — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /coaches — USED_BY_CLIENT

**Server**:
- GET /coaches @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/coaches/controllers/coaches.controller.ts:10`
```ts
import { Coach } from '../entities/coach.entity';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  async findAll(): Promise<Coach[]> {
    return this.coachesService.findAll();
  }

  @Get(':id')
```
**Client**:
- GET /coaches @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/coaches/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Coaches() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/coaches').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>coaches — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /coaches @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/coaches/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Coaches() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/coaches').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>coaches — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /coaches/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /coaches/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/coaches/controllers/coaches.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Coach[]> {
    return this.coachesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Coach> {
    return this.coachesService.findOne(Number(id));
  }
}
```

---
### GET /contents — UNUSED_SERVER_ROUTE

**Server**:
- GET /contents @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/cms/controllers/cms.controller.ts:10`
```ts
import { Cms } from '../entities/cms.entity';

@Controller('contents')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async findAll(): Promise<Cms[]> {
    return this.cmsService.findAll();
  }

  @Get(':id')
```

---
### GET /contents/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /contents/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/cms/controllers/cms.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Cms[]> {
    return this.cmsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Cms> {
    return this.cmsService.findOne(Number(id));
  }
}
```

---
### GET /corporate — UNUSED_SERVER_ROUTE

**Server**:
- GET /corporate @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/corporate/controllers/corporate.controller.ts:10`
```ts
import { Corporate } from '../entities/corporate.entity';

@Controller('corporate')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Get()
  async findAll(): Promise<Corporate[]> {
    return this.corporateService.findAll();
  }

  @Get(':id')
```

---
### GET /corporate/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /corporate/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/corporate/controllers/corporate.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Corporate[]> {
    return this.corporateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Corporate> {
    return this.corporateService.findOne(Number(id));
  }
}
```

---
### GET /courses — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /courses @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/courses/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>courses — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /courses @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/courses/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>courses — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /experiments — UNUSED_SERVER_ROUTE

**Server**:
- GET /experiments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/experiments/controllers/experiments.controller.ts:10`
```ts
import { Experiment } from '../entities/experiment.entity';

@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) {}

  @Get()
  async findAll(): Promise<Experiment[]> {
    return this.experimentsService.findAll();
  }

  @Get(':id')
```

---
### GET /experiments/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /experiments/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/experiments/controllers/experiments.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Experiment[]> {
    return this.experimentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Experiment> {
    return this.experimentsService.findOne(Number(id));
  }
}
```

---
### GET /fcm/send — UNRESOLVED_CLIENT_CALL

**Client**:
- GET https://fcm.googleapis.com/fcm/send @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications/notifications.service.ts:42`
```ts
return { id: rec.id };
  }

  async sendPush(dto: {token: string; title: string; body: string; data?: any}) {
    const serverKey = process.env.FCM_SERVER_KEY;
    if (!serverKey) throw new Error('FCM_SERVER_KEY missing');
    const resp = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: { 'Authorization': `key=${serverKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({ to: dto.token, notification: { title: dto.title, body: dto.body }, data: dto.data || {} })
    });
    const j = await resp.json();
```

---
### GET /health — UNUSED_SERVER_ROUTE

**Server**:
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/health/health.controller.ts:5`
```ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  ping() {
    return { ok: true, service: 'backend', ts: Date.now() };
  }
}
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/health/health.controller.ts:4`
```ts
import { Controller, Get } from '@nestjs/common';
@Controller('health')
export class HealthController {
  @Get()
  liveness() { return { status: 'ok', ts: Date.now() }; }
}
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```
- GET /health @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/src/health/health.controller.ts:15`
```ts
private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
```

---
### GET /healthz — UNUSED_SERVER_ROUTE

**Server**:
- GET /healthz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/common/controllers/health.controller.ts:5`
```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/healthz')
  health() { return { ok: true }; }

  @Get('/readyz')
  ready() { return { ok: true }; }
}
```
- GET /healthz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/health.controller.ts:4`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /healthz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/health.controller.ts:4`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /healthz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/health.controller.ts:4`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /healthz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/health.controller.ts:4`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /healthz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/health.controller.ts:6`
```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/healthz') health(){ return { ok: true }; }
  @Get('/ready') ready(){ return { ready: true }; }
}
```
- GET /healthz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/health.controller.ts:4`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```

---
### GET /leaderboard — UNUSED_SERVER_ROUTE

**Server**:
- GET /leaderboard @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/leaderboard/controllers/leaderboard.controller.ts:10`
```ts
import { LeaderboardEntry } from '../entities/leaderboard.entity';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.leaderboardService.getLeaderboard();
  }

  @Get(':userId')
```

---
### GET /leaderboard/:userId — UNUSED_SERVER_ROUTE

**Server**:
- GET /leaderboard/:userId @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/leaderboard/controllers/leaderboard.controller.ts:15`
```ts
@Get()
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.leaderboardService.getLeaderboard();
  }

  @Get(':userId')
  async getUserLeaderboard(@Param('userId') userId: number): Promise<LeaderboardEntry[]> {
    return this.leaderboardService.findByUser(Number(userId));
  }
}
```

---
### GET /live — UNUSED_SERVER_ROUTE

**Server**:
- GET /live @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/live/controllers/live.controller.ts:10`
```ts
import { Live } from '../entities/live.entity';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Get()
  async findAll(): Promise<Live[]> {
    return this.liveService.findAll();
  }

  @Get(':id')
```

---
### GET /live/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /live/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/live/controllers/live.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Live[]> {
    return this.liveService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Live> {
    return this.liveService.findOne(Number(id));
  }
}
```

---
### GET /marketplace — USED_BY_CLIENT

**Server**:
- GET /marketplace @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/marketplace/controllers/marketplace.controller.ts:10`
```ts
import { Marketplace } from '../entities/marketplace.entity';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  async findAll(): Promise<Marketplace[]> {
    return this.marketplaceService.findAll();
  }

  @Get(':id')
```
**Client**:
- GET /marketplace @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/marketplace/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Marketplace() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/marketplace').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>marketplace — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /marketplace @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/marketplace/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Marketplace() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/marketplace').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>marketplace — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /marketplace/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /marketplace/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/marketplace/controllers/marketplace.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Marketplace[]> {
    return this.marketplaceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Marketplace> {
    return this.marketplaceService.findOne(Number(id));
  }
}
```

---
### GET /meals — UNUSED_SERVER_ROUTE

**Server**:
- GET /meals @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/nutrition/controllers/nutrition.controller.ts:10`
```ts
import { Meal } from '../entities/meal.entity';

@Controller('meals')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get()
  async findAll(): Promise<Meal[]> {
    return this.nutritionService.findAll();
  }

  @Get(':id')
```

---
### GET /meals/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /meals/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/nutrition/controllers/nutrition.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Meal[]> {
    return this.nutritionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Meal> {
    return this.nutritionService.findOne(Number(id));
  }
}
```

---
### GET /metrics — UNUSED_SERVER_ROUTE

**Server**:
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/metrics/metrics.controller.ts:10`
```ts
@Controller()
export class MetricsController {
  constructor(private readonly metrics: MetricsService){}

  @UseGuards(MetricsGuard)
  @Get('/metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4')
  async metricsEndpoint(){ return this.metrics.getMetrics(); }
}
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/health.controller.ts:6`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/metrics/metrics.controller.ts:7`
```ts
import { Controller, Get } from '@nestjs/common';
import * as client from 'prom-client';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller('metrics')
export class MetricsController {
  @Get()
  async metrics() { return register.metrics(); }
}
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/health.controller.ts:6`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/health.controller.ts:6`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/health.controller.ts:6`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/main.ts:17`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/health.controller.ts:6`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/src/main.ts:15`
```ts
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
```
- GET /metrics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/src/metrics/metrics.controller.ts:6`
```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }
```

---
### GET /monitoring — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /monitoring @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/monitoring/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>monitoring — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /monitoring @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/monitoring/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>monitoring — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /notifications — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /notifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/notifications/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>notifications — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /notifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/notifications/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>notifications — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /notifications/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /notifications/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications-service.controller.ts:26`
```ts
@Post('push')
  queuePush(@Body() dto: any) {
    return this.svc.queuePush(dto.to, dto.body);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findById(id);
  }
}
```
- GET /notifications/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications/notifications.controller.ts:23`
```ts
@Post('push')
  sendPush(@Body() dto: {token: string; title: string; body: string; data?: any}) {
    return this.svc.sendPush(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }
}
```

---
### GET /notifications/:userId — UNUSED_SERVER_ROUTE

**Server**:
- GET /notifications/:userId @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/notifications/controllers/notifications.controller.ts:11`
```ts
import { Notification } from '../entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':userId')
  async findAll(@Param('userId') userId: number): Promise<Notification[]> {
    return this.notificationsService.findAllByUser(Number(userId));
  }
}
```

---
### GET /nutrition — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /nutrition @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/nutrition/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Nutrition() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/nutrition').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>nutrition — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /nutrition @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/nutrition/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Nutrition() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/nutrition').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>nutrition — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /payments — USED_BY_CLIENT

**Server**:
- GET /payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/payments.controller.ts:26`
```ts
@HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreatePaymentDto, @Headers('Idempotency-Key') idem?: string) {
    const res = await (this.payments as any).create({ ...body, idempotencyKey: body.idempotencyKey || idem || undefined });
    return { ok: true, data: res };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listMine(@Query() q: ListPaymentsDto, @Headers('x-user-id') xUser?: string) limit = '20', @Query('cursor') cursor?: string, @Headers('x-user-id') xUser?: string) {
    // Try to read from auth context if available; fallback to header for demo
    const userId = xUser || 'demo-user';
    if (typeof (this.payments as any).listByUser === 'function') {
```
- GET /payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:12`
```ts
*  Exposes REST endpoints for listing and verifying payments.
 */
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
```
**Client**:
- GET /payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/payments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Payments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/payments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>payments — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/payments/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Payments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/payments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>payments — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /payments/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /payments/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:17`
```ts
@Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Get('verify/callback')
```

---
### GET /payments/orders/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /payments/orders/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:34`
```ts
// Orders
  @Post('orders')
  createOrder(@Body() dto: any) {
    return this.svc.createOrder(dto.userId, dto.productId, dto.couponCode);
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.svc.getOrder(id);
  }

  // Payment Intent
```

---
### GET /payments/products — UNUSED_SERVER_ROUTE

**Server**:
- GET /payments/products @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:17`
```ts
// Products
  @Post('products')
  createProduct(@Body() dto: any) {
    return this.svc.createProduct(dto);
  }

  @Get('products')
  listProducts() {
    return this.svc.listProducts();
  }

  // Coupons
```
- GET /payments/products @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments/payments.controller.ts:13`
```ts
@Post('products')
  createProduct(@Body() dto: {name: string; priceCents: number; currency?: string}) {
    return this.svc.createProduct(dto);
  }

  @Get('products')
  listProducts() {
    return this.svc.listProducts();
  }

  @Post('orders')
```

---
### GET /payments/verify/callback — UNUSED_SERVER_ROUTE

**Server**:
- GET /payments/verify/callback @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:22`
```ts
@Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Get('verify/callback')
  async verifyCallback(@Query('Authority') authority: string, @Query('Amount') amount: string): Promise<{ success: boolean }> {
    const ok = await this.paymentsService.verify(authority, Number(amount));
    return { success: ok };
  }
}
```

---
### GET /payrolls — UNUSED_SERVER_ROUTE

**Server**:
- GET /payrolls @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payroll/controllers/payroll.controller.ts:10`
```ts
import { Payroll } from '../entities/payroll.entity';

@Controller('payrolls')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  async findAll(): Promise<Payroll[]> {
    return this.payrollService.findAll();
  }

  @Get(':id')
```

---
### GET /payrolls/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /payrolls/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payroll/controllers/payroll.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Payroll[]> {
    return this.payrollService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Payroll> {
    return this.payrollService.findOne(Number(id));
  }
}
```

---
### GET /physio — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /physio @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/physio/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>physio — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /physio @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/physio/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>physio — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /ready — UNUSED_SERVER_ROUTE

**Server**:
- GET /ready @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/health.controller.ts:7`
```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/healthz') health(){ return { ok: true }; }
  @Get('/ready') ready(){ return { ready: true }; }
}
```

---
### GET /readyz — UNUSED_SERVER_ROUTE

**Server**:
- GET /readyz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/common/controllers/health.controller.ts:8`
```ts
@Controller()
export class HealthController {
  @Get('/healthz')
  health() { return { ok: true }; }

  @Get('/readyz')
  ready() { return { ok: true }; }
}
```
- GET /readyz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/health.controller.ts:5`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /readyz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/health.controller.ts:5`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /readyz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/health.controller.ts:5`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /readyz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/health.controller.ts:5`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```
- GET /readyz @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/health.controller.ts:5`
```ts
import { Controller, Get } from '@nestjs/common'
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}
```

---
### GET /rewards — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /rewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/rewards/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>rewards — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /rewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/rewards/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>rewards — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /security/audit — UNUSED_SERVER_ROUTE

**Server**:
- GET /security/audit @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/security/controllers/security.controller.ts:9`
```ts
import { SecurityService } from '../security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('audit')
  getAuditLog() {
    return this.securityService.auditLog;
  }
}
```

---
### GET /surveys — UNUSED_SERVER_ROUTE

**Server**:
- GET /surveys @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/survey/controllers/survey.controller.ts:10`
```ts
import { Survey } from '../entities/survey.entity';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  async findAll(): Promise<Survey[]> {
    return this.surveyService.findAll();
  }

  @Get(':id')
```

---
### GET /surveys/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /surveys/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/survey/controllers/survey.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Survey[]> {
    return this.surveyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Survey> {
    return this.surveyService.findOne(Number(id));
  }
}
```

---
### GET /tickets — UNUSED_SERVER_ROUTE

**Server**:
- GET /tickets @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/support/controllers/support.controller.ts:10`
```ts
import { Support } from '../entities/support.entity';

@Controller('tickets')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  async findAll(): Promise<Support[]> {
    return this.supportService.findAll();
  }

  @Get(':id')
```

---
### GET /tickets/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /tickets/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/support/controllers/support.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<Support[]> {
    return this.supportService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Support> {
    return this.supportService.findOne(Number(id));
  }
}
```

---
### GET /users — UNUSED_SERVER_ROUTE

**Server**:
- GET /users @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/users/controllers/users.controller.ts:10`
```ts
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
```

---
### GET /users/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /users/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/users/controllers/users.controller.ts:15`
```ts
@Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(Number(id));
  }
}
```

---
### GET /vip — UNRESOLVED_CLIENT_CALL

**Client**:
- GET /vip @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/vip/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>vip — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /vip @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/vip/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>vip — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /wallets/:userId — UNUSED_SERVER_ROUTE

**Server**:
- GET /wallets/:userId @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/wallet/controllers/wallet.controller.ts:10`
```ts
import { Wallet } from '../entities/wallet.entity';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId')
  async getWallet(@Param('userId') userId: number): Promise<Wallet> {
    return this.walletService.findOne(Number(userId));
  }
}
```

---
### GET /workouts — USED_BY_CLIENT

**Server**:
- GET /workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/workouts/controllers/workouts.controller.ts:9`
```ts
import { Workout as PrismaWorkout } from '@prisma/client';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  findAll(): Promise<PrismaWorkout[]> {
    return this.workoutsService.findAll();
  }

  @Get(':id')
```
- GET /workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:11`
```ts
@ApiTags('workouts')
@ApiBearerAuth()
@Controller('workouts')
export class Workouts_serviceController {
  constructor(private readonly svc: WorkoutsService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

  @Post()
```
- GET /workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts/workouts.controller.ts:8`
```ts
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly svc: WorkoutsService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

  @Get(':id')
```
**Client**:
- GET /workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/src/features/workouts/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Workouts() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/workouts').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>workouts — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```
- GET /workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/src/features/workouts/index.tsx:5`
```ts
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Workouts() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/workouts').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>workouts — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}
```

---
### GET /workouts/:id — UNUSED_SERVER_ROUTE

**Server**:
- GET /workouts/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/workouts/controllers/workouts.controller.ts:14`
```ts
@Get()
  findAll(): Promise<PrismaWorkout[]> {
    return this.workoutsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PrismaWorkout> {
    return this.workoutsService.findOne(Number(id));
  }
}
```
- GET /workouts/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:21`
```ts
@Post()
  create(@Body() dto: any) {
    return this.svc.create(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Put(':id')
```
- GET /workouts/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts/workouts.controller.ts:13`
```ts
@Get()
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
```

---
### POST / — UNUSED_SERVER_ROUTE

**Server**:
- POST / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/presentation/controllers/auth.controller.ts:12`
```ts
/** REST Auth endpoints */
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthUseCase) {}

  @Post(API_ROUTES.AUTH.LOGIN)
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }
```
- POST / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/presentation/controllers/auth.controller.ts:18`
```ts
@Post(API_ROUTES.AUTH.LOGIN)
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }

  @Post(API_ROUTES.AUTH.REFRESH)
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.token);
  }
}
```
- POST / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/presentation/controllers/payments.controller.ts:13`
```ts
/** REST Payments endpoints */
@Controller()
export class PaymentsController {
  constructor(private readonly payments: PaymentsUseCase) {}

  @Post(API_ROUTES.PAYMENTS.ROOT)
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Headers('x-user-id') userId: string,
    @Headers('idempotency-key') idemKey: string | undefined,
    @Body() dto: CreatePaymentDto,
```
- POST / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:8`
```ts
import { RewardsService } from './rewards.service'
@Controller()
export class RewardsController {
  constructor(private svc: RewardsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- POST / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:8`
```ts
import { PhysioService } from './physio.service'
@Controller()
export class PhysioController {
  constructor(private svc: PhysioService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- POST / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:8`
```ts
import { AssessmentsService } from './assessments.service'
@Controller()
export class AssessmentsController {
  constructor(private svc: AssessmentsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- POST / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:8`
```ts
import { AnalyticsService } from './analytics.service'
@Controller()
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- POST / @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:8`
```ts
import { BookingService } from './booking.service'
@Controller()
export class BookingController {
  constructor(private svc: BookingService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```

---
### POST /admin/login — UNUSED_SERVER_ROUTE

**Server**:
- POST /admin/login @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/auth/admin.controller.ts:22`
```ts
return users.find((x) => x.u === username);
}

@Controller('admin')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AdminController {
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: AdminLoginDto) {
    const secret = process.env.ADMIN_JWT_SECRET;
    const usersRaw = process.env.ADMIN_USERS_JSON || '[]';
    if (!secret) throw new UnauthorizedException('admin jwt not configured');
```

---
### POST /auth/login — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/login @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/auth/auth.controller.ts:17`
```ts
@Controller('auth') // see API_ROUTES.auth
@UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const tokens = await this.auth.login(body);
    return { ok: true, data: tokens };
  }
```
- POST /auth/login @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/auth.controller.ts:15`
```ts
@Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
```

---
### POST /auth/logout — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/logout @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/auth/auth.controller.ts:31`
```ts
@HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshDto) {
    const tokens = await this.auth.refresh(body.refreshToken);
    return { ok: true, data: tokens };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // stateless logout — clients should delete tokens; optional server-side blacklist could be added later
    return { ok: true };
  }
```

---
### POST /auth/password/confirm — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/password/confirm @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/password-reset.controller.ts:16`
```ts
@Post('request')
  async request(@Body() dto: RequestDto) {
    return this.svc.request(dto.email);
  }

  @Post('confirm')
  async confirm(@Body() dto: ConfirmDto) {
    return this.svc.confirm(dto.email, dto.token, dto.newPassword);
  }
}
```

---
### POST /auth/password/request — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/password/request @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/password-reset.controller.ts:11`
```ts
class ConfirmDto { email: string; token: string; newPassword: string; }

@Controller('auth/password')
export class PasswordResetController {
  constructor(private readonly svc: PasswordResetService) {}

  @Post('request')
  async request(@Body() dto: RequestDto) {
    return this.svc.request(dto.email);
  }

  @Post('confirm')
```

---
### POST /auth/refresh — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/refresh @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/auth/auth.controller.ts:24`
```ts
@HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const tokens = await this.auth.login(body);
    return { ok: true, data: tokens };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshDto) {
    const tokens = await this.auth.refresh(body.refreshToken);
    return { ok: true, data: tokens };
  }
```
- POST /auth/refresh @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/auth.controller.ts:20`
```ts
@Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: any, @Body() dto: RefreshDto) {
    return this.auth.refresh(req.user.sub, dto.refreshToken);
  }
```

---
### POST /auth/register — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/register @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/auth.controller.ts:10`
```ts
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
```

---
### POST /auth/totp/disable — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/totp/disable @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/totp.controller.ts:22`
```ts
@Post('verify')
  async verify(@Req() req: any, @Body() dto: VerifyDto) {
    return this.totp.verify(req.user.sub, dto.code);
  }

  @Post('disable')
  async disable(@Req() req: any) {
    return this.totp.disable(req.user.sub);
  }
}
```

---
### POST /auth/totp/enable — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/totp/enable @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/totp.controller.ts:12`
```ts
@Controller('auth/totp')
@UseGuards(JwtAuthGuard)
export class TotpController {
  constructor(private readonly totp: TotpService) {}

  @Post('enable')
  async enable(@Req() req: any) {
    return this.totp.enable(req.user.sub);
  }

  @Post('verify')
```

---
### POST /auth/totp/verify — UNUSED_SERVER_ROUTE

**Server**:
- POST /auth/totp/verify @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/auth/totp.controller.ts:17`
```ts
@Post('enable')
  async enable(@Req() req: any) {
    return this.totp.enable(req.user.sub);
  }

  @Post('verify')
  async verify(@Req() req: any, @Body() dto: VerifyDto) {
    return this.totp.verify(req.user.sub, dto.code);
  }

  @Post('disable')
```

---
### POST /cert/issue — UNUSED_SERVER_ROUTE

**Server**:
- POST /cert/issue @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/certificate/certificate.controller.ts:10`
```ts
import { CertificateService } from './certificate.service';

@Controller('cert')
export class CertificateController {
  constructor(private readonly svc: CertificateService) {}

  @Post('issue')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async issue(@Body() body: any) {
    return this.svc.issueCertificate(body);
  }
```

---
### POST /live/egress/start — UNUSED_SERVER_ROUTE

**Server**:
- POST /live/egress/start @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/livekit/livekit.controller.ts:25`
```ts
@Post('room/delete')
  async delete(@Body() body: { room: string }) {
    return this.live.deleteRoom(body.room);
  }

  @Post('egress/start')
  async startEgress(@Body() body: { room: string; filepath?: string; livestreamUrl?: string }) {
    return this.live.startCompositeEgress(body.room, { filepath: body.filepath, livestreamUrl: body.livestreamUrl });
  }

  @Post('egress/stop')
```

---
### POST /live/egress/stop — UNUSED_SERVER_ROUTE

**Server**:
- POST /live/egress/stop @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/livekit/livekit.controller.ts:30`
```ts
@Post('egress/start')
  async startEgress(@Body() body: { room: string; filepath?: string; livestreamUrl?: string }) {
    return this.live.startCompositeEgress(body.room, { filepath: body.filepath, livestreamUrl: body.livestreamUrl });
  }

  @Post('egress/stop')
  async stopEgress(@Body() body: { egressId: string }) {
    return this.live.stopEgress(body.egressId);
  }
}
```

---
### POST /live/room/create — UNUSED_SERVER_ROUTE

**Server**:
- POST /live/room/create @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/livekit/livekit.controller.ts:15`
```ts
@HttpCode(HttpStatus.OK)
  issueToken(@Body() body: { room: string; identity: string; role?: LiveRole; ttlSeconds?: number }) {
    const role: LiveRole = body.role ?? 'viewer';
    return this.live.issueToken({ room: body.room, identity: body.identity, role, ttlSeconds: body.ttlSeconds });
  }

  @Post('room/create')
  async create(@Body() body: { room: string }) {
    return this.live.createRoom(body.room);
  }

  @Post('room/delete')
```

---
### POST /live/room/delete — UNUSED_SERVER_ROUTE

**Server**:
- POST /live/room/delete @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/livekit/livekit.controller.ts:20`
```ts
@Post('room/create')
  async create(@Body() body: { room: string }) {
    return this.live.createRoom(body.room);
  }

  @Post('room/delete')
  async delete(@Body() body: { room: string }) {
    return this.live.deleteRoom(body.room);
  }

  @Post('egress/start')
```

---
### POST /live/token — UNUSED_SERVER_ROUTE

**Server**:
- POST /live/token @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/livekit/livekit.controller.ts:8`
```ts
import { LivekitService, LiveRole } from './livekit.service';

@Controller('live')
export class LivekitController {
  constructor(private readonly live: LivekitService) {}

  @Post('token')
  @HttpCode(HttpStatus.OK)
  issueToken(@Body() body: { room: string; identity: string; role?: LiveRole; ttlSeconds?: number }) {
    const role: LiveRole = body.role ?? 'viewer';
    return this.live.issueToken({ room: body.room, identity: body.identity, role, ttlSeconds: body.ttlSeconds });
  }
```

---
### POST /media/confirm — UNUSED_SERVER_ROUTE

**Server**:
- POST /media/confirm @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/media/media-upload.controller.ts:7`
```ts
import { requireEnv } from '../common/utils/nulls';
import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';

@Controller('media')
export class MediaUploadController {
  @Post('confirm')
  async confirm(@Body() body: ConfirmUploadDto) {
    const bucket = body.bucket || requireEnv('S3_BUCKET');
    // اینجا منطق ذخیره در دیتابیس/صف را بگذارید
    return { ok: true, bucket, key: body.key };
  }
```

---
### POST /notifications/email — UNUSED_SERVER_ROUTE

**Server**:
- POST /notifications/email @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications-service.controller.ts:11`
```ts
@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class Notifications_serviceController {
  constructor(private readonly svc: NotificationsService) {}

  @Post('email')
  queueEmail(@Body() dto: any) {
    return this.svc.queueEmail(dto.to, dto.subject, dto.body);
  }

  @Post('sms')
```
- POST /notifications/email @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications/notifications.controller.ts:8`
```ts
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Post('email')
  sendEmail(@Body() dto: {to: string; subject: string; html: string}) {
    return this.svc.sendEmail(dto);
  }

  @Post('sms')
```

---
### POST /notifications/push — UNUSED_SERVER_ROUTE

**Server**:
- POST /notifications/push @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications-service.controller.ts:21`
```ts
@Post('sms')
  queueSms(@Body() dto: any) {
    return this.svc.queueSms(dto.to, dto.body);
  }

  @Post('push')
  queuePush(@Body() dto: any) {
    return this.svc.queuePush(dto.to, dto.body);
  }

  @Get(':id')
```
- POST /notifications/push @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications/notifications.controller.ts:18`
```ts
@Post('sms')
  sendSms(@Body() dto: {to: string; body: string}) {
    return this.svc.sendSms(dto);
  }

  @Post('push')
  sendPush(@Body() dto: {token: string; title: string; body: string; data?: any}) {
    return this.svc.sendPush(dto);
  }

  @Get(':id')
```

---
### POST /notifications/sms — UNUSED_SERVER_ROUTE

**Server**:
- POST /notifications/sms @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications-service.controller.ts:16`
```ts
@Post('email')
  queueEmail(@Body() dto: any) {
    return this.svc.queueEmail(dto.to, dto.subject, dto.body);
  }

  @Post('sms')
  queueSms(@Body() dto: any) {
    return this.svc.queueSms(dto.to, dto.body);
  }

  @Post('push')
```
- POST /notifications/sms @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications/notifications.controller.ts:13`
```ts
@Post('email')
  sendEmail(@Body() dto: {to: string; subject: string; html: string}) {
    return this.svc.sendEmail(dto);
  }

  @Post('sms')
  sendSms(@Body() dto: {to: string; body: string}) {
    return this.svc.sendSms(dto);
  }

  @Post('push')
```

---
### POST /payments — UNUSED_SERVER_ROUTE

**Server**:
- POST /payments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/payments.controller.ts:19`
```ts
@Controller('payments') // see API_ROUTES.payments
@UseGuards(JwtAuthGuard)
@UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreatePaymentDto, @Headers('Idempotency-Key') idem?: string) {
    const res = await (this.payments as any).create({ ...body, idempotencyKey: body.idempotencyKey || idem || undefined });
    return { ok: true, data: res };
  }
```

---
### POST /payments/coupons — UNUSED_SERVER_ROUTE

**Server**:
- POST /payments/coupons @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:23`
```ts
@Get('products')
  listProducts() {
    return this.svc.listProducts();
  }

  // Coupons
  @Post('coupons')
  createCoupon(@Body() dto: any) {
    return this.svc.createCoupon(dto.code, dto.percentOff);
  }

  // Orders
```
- POST /payments/coupons @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments/payments.controller.ts:39`
```ts
@Post('subscriptions')
  createSubscription(@Body() dto: {userId: string; productId: string}) {
    return this.svc.createSubscription(dto);
  }

  @Post('coupons')
  createCoupon(@Body() dto: {code: string; percentOff: number}) {
    return this.svc.createCoupon(dto);
  }
}
```

---
### POST /payments/intent/:orderId — UNUSED_SERVER_ROUTE

**Server**:
- POST /payments/intent/:orderId @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:40`
```ts
@Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.svc.getOrder(id);
  }

  // Payment Intent
  @Post('intent/:orderId')
  createIntent(@Param('orderId') orderId: string) {
    return this.svc.createIntent(orderId);
  }

  // Webhook (raw body)
```
- POST /payments/intent/:orderId @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments/payments.controller.ts:23`
```ts
@Post('orders')
  createOrder(@Body() dto: {userId: string; productId: string; couponCode?: string}) {
    return this.svc.createOrder(dto);
  }

  @Post('intent/:orderId')
  createPaymentIntent(@Param('orderId') orderId: string) {
    return this.svc.createPaymentIntent(orderId);
  }

  @Post('webhook')
```

---
### POST /payments/orders — UNUSED_SERVER_ROUTE

**Server**:
- POST /payments/orders @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:29`
```ts
@Post('coupons')
  createCoupon(@Body() dto: any) {
    return this.svc.createCoupon(dto.code, dto.percentOff);
  }

  // Orders
  @Post('orders')
  createOrder(@Body() dto: any) {
    return this.svc.createOrder(dto.userId, dto.productId, dto.couponCode);
  }

  @Get('orders/:id')
```
- POST /payments/orders @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments/payments.controller.ts:18`
```ts
@Get('products')
  listProducts() {
    return this.svc.listProducts();
  }

  @Post('orders')
  createOrder(@Body() dto: {userId: string; productId: string; couponCode?: string}) {
    return this.svc.createOrder(dto);
  }

  @Post('intent/:orderId')
```

---
### POST /payments/plans — UNUSED_SERVER_ROUTE

**Server**:
- POST /payments/plans @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:52`
```ts
@Post('webhook')
  webhook(@Req() req: any, @Headers('stripe-signature') sig?: string) {
    return this.svc.handleWebhook(req.rawBody || req.body, sig);
  }

  // Subscriptions
  @Post('plans')
  createPlan(@Body() dto: any) {
    return this.svc.createPlan(dto.productId, dto.interval, dto.priceCents, dto.trialDays);
  }

  @Post('subscriptions')
```

---
### POST /payments/products — UNUSED_SERVER_ROUTE

**Server**:
- POST /payments/products @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:12`
```ts
@ApiBearerAuth()
@Controller('payments')
export class Payments_serviceController {
  constructor(private readonly svc: PaymentsService) {}

  // Products
  @Post('products')
  createProduct(@Body() dto: any) {
    return this.svc.createProduct(dto);
  }

  @Get('products')
```
- POST /payments/products @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments/payments.controller.ts:8`
```ts
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly svc: PaymentsService) {}

  @Post('products')
  createProduct(@Body() dto: {name: string; priceCents: number; currency?: string}) {
    return this.svc.createProduct(dto);
  }

  @Get('products')
```

---
### POST /payments/subscriptions — UNUSED_SERVER_ROUTE

**Server**:
- POST /payments/subscriptions @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:57`
```ts
// Subscriptions
  @Post('plans')
  createPlan(@Body() dto: any) {
    return this.svc.createPlan(dto.productId, dto.interval, dto.priceCents, dto.trialDays);
  }

  @Post('subscriptions')
  subscribe(@Body() dto: any) {
    return this.svc.subscribe(dto.userId, dto.planId);
  }
}
```
- POST /payments/subscriptions @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments/payments.controller.ts:34`
```ts
@Post('webhook')
  webhook(@Req() req: any) {
    // raw body expected: ensure main.ts uses raw body for this route
    return this.svc.handleWebhook(req.headers['stripe-signature'], req.rawBody);
  }

  @Post('subscriptions')
  createSubscription(@Body() dto: {userId: string; productId: string}) {
    return this.svc.createSubscription(dto);
  }

  @Post('coupons')
```

---
### POST /payments/webhook — UNUSED_SERVER_ROUTE

**Server**:
- POST /payments/webhook @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/webhook.controller.ts:14`
```ts
private verifySignature(rawBody: string, sigHeader: string|undefined, secret: string) {
    if (!sigHeader) return false;
    const h = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sigHeader));
  }

  @Post('webhook')
  async handle(@Req() req, @Res() res) {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || '';
    const sig = req.headers['x-signature'] as string | undefined;
    const raw = (req as any).rawBody || JSON.stringify(req.body || {});
    if (!secret || !this.verifySignature(raw, sig, secret)) {
```
- POST /payments/webhook @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments-service.controller.ts:46`
```ts
@Post('intent/:orderId')
  createIntent(@Param('orderId') orderId: string) {
    return this.svc.createIntent(orderId);
  }

  // Webhook (raw body)
  @Post('webhook')
  webhook(@Req() req: any, @Headers('stripe-signature') sig?: string) {
    return this.svc.handleWebhook(req.rawBody || req.body, sig);
  }

  // Subscriptions
```
- POST /payments/webhook @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/payments/payments.controller.ts:28`
```ts
@Post('intent/:orderId')
  createPaymentIntent(@Param('orderId') orderId: string) {
    return this.svc.createPaymentIntent(orderId);
  }

  @Post('webhook')
  webhook(@Req() req: any) {
    // raw body expected: ensure main.ts uses raw body for this route
    return this.svc.handleWebhook(req.headers['stripe-signature'], req.rawBody);
  }
```

---
### POST /reservations/cancel — UNUSED_SERVER_ROUTE

**Server**:
- POST /reservations/cancel @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/reservations/reservations.controller.ts:22`
```ts
const r = await this.reservations.reserve(body.userId, body.slotId);
      reservationsCreated.inc({ status: 'ok' });
      return { ok: true, reservation: { id: r.id, slotId: r.slotId } };
    });
  }

  @Post('cancel')
  async cancel(@Body() body: any) {
    return await withSpan('reservations.cancel', { 'reservation.id': body.reservationId }, async () => {
      const r = await this.reservations.cancel(body.reservationId);
      reservationsCreated.inc({ status: 'cancel' });
      return { ok: true, reservation: { id: r.id } };
```

---
### POST /reservations/reserve — UNUSED_SERVER_ROUTE

**Server**:
- POST /reservations/reserve @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/reservations/reservations.controller.ts:12`
```ts
@Controller('reservations')
export class ReservationsController {
  private jwt = new JwtKidService();
  constructor(private readonly reservations: ReservationService) {}

  @Post('reserve')
  async reserve(@Body() body: any) {
    // Optional auth via JWT (if Authorization header provided)
    return await withSpan('reservations.reserve', { 'user.id': body.userId, 'slot.id': body.slotId }, async () => {
      const r = await this.reservations.reserve(body.userId, body.slotId);
      reservationsCreated.inc({ status: 'ok' });
```

---
### POST /workouts — UNUSED_SERVER_ROUTE

**Server**:
- POST /workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:16`
```ts
@Get()
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

  @Post()
  create(@Body() dto: any) {
    return this.svc.create(dto);
  }

  @Get(':id')
```
- POST /workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts/workouts.controller.ts:18`
```ts
@Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
  create(@Body() dto: {userId: string; title: string; level: 'beginner'|'intermediate'|'advanced'; goal: 'fatloss'|'strength'|'hypertrophy'; equipment?: string[]}) {
    return this.svc.create(dto);
  }
}
```

---
### PUT /:id — UNUSED_SERVER_ROUTE

**Server**:
- PUT /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:9`
```ts
@Controller()
export class RewardsController {
  constructor(private svc: RewardsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- PUT /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:9`
```ts
@Controller()
export class PhysioController {
  constructor(private svc: PhysioService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- PUT /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:9`
```ts
@Controller()
export class AssessmentsController {
  constructor(private svc: AssessmentsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- PUT /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:9`
```ts
@Controller()
export class AnalyticsController {
  constructor(private svc: AnalyticsService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```
- PUT /:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:9`
```ts
@Controller()
export class BookingController {
  constructor(private svc: BookingService){}
  @Get() list(){ return this.svc.list() }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(id) }
  @Post() create(@Body() dto:any){ return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id:string, @Body() dto:any){ return this.svc.update(id,dto) }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(id) }
}
```

---
### PUT /workouts/:id — UNUSED_SERVER_ROUTE

**Server**:
- PUT /workouts/:id @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:26`
```ts
@Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
```

---
