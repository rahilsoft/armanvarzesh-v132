# GraphQL Contract Census

## UNUSED_GRAPHQL_OPERATIONS (server has, no client usage)

- Query Amount @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:23`
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
- Query Authority @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:23`
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
- Query cursor @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/payments.controller.ts:28`
```ts
const res = await (this.payments as any).create({ ...body, idempotencyKey: body.idempotencyKey || idem || undefined });
    return { ok: true, data: res };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listMine(@Query() q: ListPaymentsDto, @Headers('x-user-id') xUser?: string) limit = '20', @Query('cursor') cursor?: string, @Headers('x-user-id') xUser?: string) {
    // Try to read from auth context if available; fallback to header for demo
    const userId = xUser || 'demo-user';
    if (typeof (this.payments as any).listByUser === 'function') {
      const out = await (this.payments as any).listByUser({ userId, limit: Number(q?.limit||20), cursor: q?.cursor });
      return { ok: true, data: out.items, nextCursor: out.nextCursor };
```
- Query q @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:12`
```ts
@ApiBearerAuth()
@Controller('workouts')
export class Workouts_serviceController {
  constructor(private readonly svc: WorkoutsService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

  @Post()
  create(@Body() dto: any) {
```
- Query t @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/certificate/certificate.controller.ts:18`
```ts
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
- Query userId @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/bff-web/bff-web.controller.ts:8`
```ts
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
    return { user: { id: user?.id, name: user?.name }, recentWorkouts: workouts };
```

## UNRESOLVED_CLIENT_OPERATIONS (client has, no server)

- mutation AddNote @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:39`
```ts
export const ARCHIVE_CLIENT = gql`
  mutation ArchiveClient($id:ID!){
    archiveClient(id:$id)
  }
`;

export const ADD_NOTE = gql`
  mutation AddNote($clientId:ID!, $body:String!){
    addClientNote(clientId:$clientId, body:$body){
      id body createdAt author { id name }
    }
  }
```
- mutation ArchiveClient @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:33`
```ts
export const UPSERT_CLIENT = gql`
  mutation UpsertClient($input:UpsertClientInput!){
    upsertClient(input:$input){ id name email avatar status }
  }
`;

export const ARCHIVE_CLIENT = gql`
  mutation ArchiveClient($id:ID!){
    archiveClient(id:$id)
  }
`;
```
- mutation AssignPlan @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:50`
```ts
export const PUBLISH_PLAN = gql`
  mutation PublishPlan($id:ID!){
    publishPlan(id:$id){ id status version updatedAt }
  }
`;

export const ASSIGN_PLAN = gql`
  mutation AssignPlan($planId:ID!, $clientId:ID!, $startDate:String!, $sessionsPerWeek:Int!, $restDays:[String!]!, $durationDays:Int!){
    assignPlan(planId:$planId, clientId:$clientId, startDate:$startDate, sessionsPerWeek:$sessionsPerWeek, restDays:$restDays, durationDays:$durationDays){ id planId clientId startDate sessionsPerWeek restDays durationDays }
  }
`;
```
- mutation BookReservation @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/reservation.mutations.ts:3`
```ts
import { gql } from "@apollo/client";

export const BOOK_RESERVATION = gql`
  mutation BookReservation($input: CreateReservationInput!) {
    bookReservation(input: $input) { id coachId slotId status startsAt endsAt }
  }
`;
```
- mutation CancelReservation @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/reservation.mutations.ts:9`
```ts
export const BOOK_RESERVATION = gql`
  mutation BookReservation($input: CreateReservationInput!) {
    bookReservation(input: $input) { id coachId slotId status startsAt endsAt }
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($id: String!) {
    cancelReservation(id: $id)
  }
`;
```
- query Client @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:14`
```ts
pageInfo{ endCursor hasNextPage }
      total
    }
  }
`;

export const CLIENT_BY_ID = gql`
  query Client($id:ID!){
    client(id:$id){
      id name email avatar phone status height weight birthday
      goals { id title note createdAt }
      notes { id body createdAt author { id name } }
```
- query ClientNotes @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:47`
```ts
addClientNote(clientId:$clientId, body:$body){
      id body createdAt author { id name }
    }
  }
`;

export const CLIENT_NOTES = gql`
  query ClientNotes($clientId:ID!, $cursor:String, $limit:Int){
    clientNotes(clientId:$clientId, cursor:$cursor, limit:$limit){
      edges{ id body createdAt author { id name } }
      pageInfo{ endCursor hasNextPage }
    }
```
- query Clients @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const CLIENTS_LIST = gql`
  query Clients($search:String, $cursor:String, $limit:Int){
    clients(search:$search, cursor:$cursor, limit:$limit){
      edges{ id name email avatar status lastActiveAt }
      pageInfo{ endCursor hasNextPage }
      total
```
- query CoachAvailability @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/availability.queries.ts:3`
```ts
import { gql } from "@apollo/client";

export const COACH_AVAILABILITY = gql`
  query CoachAvailability($coachId: String!) {
    coachAvailability(coachId: $coachId) {
      id coachId start end recurrence createdAt
    }
  }
```
- query CoachReservations @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/availability.queries.ts:11`
```ts
coachAvailability(coachId: $coachId) {
      id coachId start end recurrence createdAt
    }
  }
`;

export const COACH_RESERVATIONS = gql`
  query CoachReservations($coachId: String!) {
    coachReservations(coachId: $coachId) {
      id userId startsAt endsAt status createdAt
    }
  }
```
- mutation CreateAdmin @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/admin.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: AdminInput!) {
    createAdmin(input: $input) { id }
  }
`;
```
- mutation CreateAvailability @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/mutations/availability.mutations.ts:3`
```ts
import { gql } from "@apollo/client";

export const CREATE_AVAILABILITY = gql`
  mutation CreateAvailability($input: CreateAvailabilityInput!) {
    createAvailability(input: $input) { id coachId start end recurrence }
  }
`;
```
- mutation CreateChallenge @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/challenge.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_CHALLENGE = gql`
  mutation CreateChallenge($input: ChallengeInput!) {
    createChallenge(input: $input) { id }
  }
`;
```
- mutation CreateCoach @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/coach.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_COACH = gql`
  mutation CreateCoach($input: CoachInput!) {
    createCoach(input: $input) { id }
  }
`;
```
- mutation CreateNotification @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/notification.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: NotificationInput!) {
    createNotification(input: $input) { id }
  }
`;
```
- mutation CreateNutritionPlan @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/nutrition.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_NUTRITION_PLAN = gql`
  mutation CreateNutritionPlan($input: NutritionPlanInput!) {
    createNutritionPlan(input: $input) { id }
  }
`;
```
- mutation CreatePayment @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/payment.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: PaymentInput!) {
    createPayment(input: $input) { id }
  }
`;
```
- mutation CreateProduct @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/product.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) { id }
  }
`;
```
- mutation CreateReward @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/reward.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_REWARD = gql`
  mutation CreateReward($input: RewardInput!) {
    createReward(input: $input) { id }
  }
`;
```
- mutation CreateSurvey @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/survey.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($input: SurveyInput!) {
    createSurvey(input: $input) { id }
  }
`;
```
- mutation CreateUser @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/user.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) { id }
  }
`;
```
- mutation CreateWorkout @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/web-core/src/hooks.ts:4`
```ts
import { gql, useQuery, useMutation } from '@apollo/client';

export const Q_WORKOUTS = gql`query Workouts{ workouts{ id name } }`;
export const M_CREATE_WORKOUT = gql`mutation CreateWorkout($input:WorkoutInput!){ createWorkout(input:$input){ id name } }`;
// NOTE: Map these to your exact backend schema.

export function useWorkouts(){
  const q = useQuery(Q_WORKOUTS);
  return q;
```
- query DailySummary @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/queries/nutrition.queries.ts:3`
```ts
import { gql } from "@apollo/client";
export const FOOD_SEARCH = gql`query FoodSearch($q:String!){ foodSearch(q:$q){ id title protein carbs fat calories } }`;
export const DAILY_SUMMARY = gql`query DailySummary($userId:Int!, $dateISO:String!){ userDailyNutrition(userId:$userId, dateISO:$dateISO){ calories protein carbs fat } }`;
```
- mutation DeleteUser @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/user.mutations.ts:16`
```ts
export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $input: UserInput!) {
    updateUser(id: $id, input: $input) { id }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;
```
- mutation DeleteWorkout @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/workout.mutations.ts:25`
```ts
id
    }
  }
`;

// Delete a workout by its ID. Returns true if removed.
export const DELETE_WORKOUT = gql`
  mutation DeleteWorkout($id: Int!) {
    deleteWorkout(id: $id)
  }
`;
```
- mutation DuplicatePlan @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:38`
```ts
upsertPlan(input:$input){
      id title description status version updatedAt
    }
  }
`;

export const DUPLICATE_PLAN = gql`
  mutation DuplicatePlan($id:ID!){
    duplicatePlan(id:$id){ id title description status version }
  }
`;
```
- query Exercises @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:56`
```ts
export const ASSIGN_PLAN = gql`
  mutation AssignPlan($planId:ID!, $clientId:ID!, $startDate:String!, $sessionsPerWeek:Int!, $restDays:[String!]!, $durationDays:Int!){
    assignPlan(planId:$planId, clientId:$clientId, startDate:$startDate, sessionsPerWeek:$sessionsPerWeek, restDays:$restDays, durationDays:$durationDays){ id planId clientId startDate sessionsPerWeek restDays durationDays }
  }
`;

export const EXERCISE_LIBRARY = gql`
  query Exercises($search:String, $muscle:String, $equipment:String, $cursor:String, $limit:Int){
    exercises(search:$search, muscle:$muscle, equipment:$equipment, cursor:$cursor, limit:$limit){
      edges{ id name muscleGroup equipment media }
      pageInfo{ endCursor hasNextPage }
      total
```
- query FoodSearch @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/queries/nutrition.queries.ts:2`
```ts
import { gql } from "@apollo/client";
export const FOOD_SEARCH = gql`query FoodSearch($q:String!){ foodSearch(q:$q){ id title protein carbs fat calories } }`;
export const DAILY_SUMMARY = gql`query DailySummary($userId:Int!, $dateISO:String!){ userDailyNutrition(userId:$userId, dateISO:$dateISO){ calories protein carbs fat } }`;
```
- query GetAdmins @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/admin.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_ADMINS = gql`
  query GetAdmins {
    admins {
      id
      name
      email
```
- query GetAnalytics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/analytics.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_ANALYTICS = gql`
  query GetAnalytics {
    analytics {
      users
      payments
      challenges
```
- query GetChallenge @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/challenge.queries.ts:14`
```ts
title
      participants
    }
  }
`;

export const GET_CHALLENGE = gql`
  query GetChallenge($id: Int!) {
    challenge(id: $id) {
      id
      title
      participants
```
- query GetChallenges @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/challenge.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_CHALLENGES = gql`
  query GetChallenges {
    challenges {
      id
      title
      participants
```
- query GetChat @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/chat.queries.ts:2`
```ts
import { gql } from "@apollo/client";
export const GET_CHAT = gql`
  query GetChat($userA:Int!, $userB:Int!) {
    getChat(userA:$userA, userB:$userB) {
      id senderId receiverId content attachmentId createdAt
    }
  }
```
- query GetCoach @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/coach.queries.ts:14`
```ts
name
      email
    }
  }
`;

export const GET_COACH = gql`
  query GetCoach($id: Int!) {
    coach(id: $id) {
      id
      name
      email
```
- query GetCoaches @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/coach.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_COACHES = gql`
  query GetCoaches {
    coaches {
      id
      name
      email
```
- query GetNotifications @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/notification.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      text
      createdAt
```
- query GetNutritionPlans @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/nutrition.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_NUTRITION_PLANS = gql`
  query GetNutritionPlans {
    nutritionPlans {
      id
      title
      calories
```
- query GetPayment @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/payment.queries.ts:15`
```ts
amount
      status
    }
  }
`;

export const GET_PAYMENT = gql`
  query GetPayment($id: Int!) {
    payment(id: $id) {
      id
      user
      amount
```
- query GetPayments @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/payment.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      user
      amount
```
- query GetProducts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/product.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      price
```
- query GetRewards @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/reward.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_REWARDS = gql`
  query GetRewards {
    rewards {
      id
      title
      xp
```
- query GetSurveys @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/survey.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_SURVEYS = gql`
  query GetSurveys {
    surveys {
      id
      question
    }
```
- query GetUser @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/user.queries.ts:15`
```ts
email
      role
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      name
      email
```
- query GetUserWorkouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/workout.queries.ts:40`
```ts
userId
    }
  }
`;

// Fetch workouts for a specific user.
export const GET_USER_WORKOUTS = gql`
  query GetUserWorkouts($userId: Int!) {
    userWorkouts(userId: $userId) {
      id
      title
      duration
```
- query GetUsers @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/user.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
```
- query GetWallets @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/wallet.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_WALLETS = gql`
  query GetWallets {
    wallets {
      id
      user
      balance
```
- query GetWorkout @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/workout.queries.ts:22`
```ts
mediaUrl
      userId
    }
  }
`;

export const GET_WORKOUT = gql`
  query GetWorkout($id: Int!) {
    workout(id: $id) {
      id
      title
      duration
```
- query GetWorkouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/workout.queries.ts:5`
```ts
import { gql } from "@apollo/client";

// Fetch all workouts across all users. Use sparingly in admin dashboards.
export const GET_WORKOUTS = gql`
  query GetWorkouts {
    workouts {
      id
      title
      duration
```
- mutation LogActualWorkout @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/workout.mutations.ts:34`
```ts
}
`;

// Log the actual performance data for a workout. Accepts the workout ID
// and an UpdateWorkoutInput containing metrics like sets, reps, weight, RPE,
// notes and mediaUrl. Returns the updated workout ID.
export const LOG_ACTUAL_WORKOUT = gql`
  mutation LogActualWorkout($id: Int!, $input: UpdateWorkoutInput!) {
    logActual(id: $id, input: $input) {
      id
    }
  }
```
- mutation LogMeal @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/nutrition.mutations.ts:2`
```ts
import { gql } from "@apollo/client";
export const LOG_MEAL = gql`mutation LogMeal($input:LogMealInput!){ logMeal(input:$input){ id userId foodId grams createdAt } }`;
```
- mutation LoginCoach @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/auth.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const LOGIN_COACH = gql`
  mutation LoginCoach($email:String!,$password:String!){
    login(email:$email, password:$password){
      token
      coach { id email name role }
      refreshToken
```
- mutation MarkAllNotificationsRead @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/notification.mutations.ts:9`
```ts
export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: Int!) {
    markNotificationRead(id: $id) { id read text createdAt }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead($userId: Int!) {
    markAllNotificationsRead(userId: $userId)
  }
`;
```
- mutation MarkNotificationRead @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/notification.mutations.ts:3`
```ts
import { gql } from "@apollo/client";

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: Int!) {
    markNotificationRead(id: $id) { id read text createdAt }
  }
`;
```
- subscription MessageReceived @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/subscriptions/chat.subs.ts:2`
```ts
import { gql } from "@apollo/client";
export const MESSAGE_RECEIVED = gql`
  subscription MessageReceived($userId: Int!) {
    messageReceived(userId: $userId) { id senderId receiverId content attachmentId createdAt }
  }
`;
```
- subscription NotificationReceived @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/subscriptions/notification.subs.ts:3`
```ts
import { gql } from "@apollo/client";

export const NOTIFICATION_RECEIVED = gql`
  subscription NotificationReceived($userId: Int!) {
    notificationReceived(userId: $userId) {
      id
      text
      read
```
- query Plan @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:14`
```ts
pageInfo{ endCursor hasNextPage }
      total
    }
  }
`;

export const PLAN_BY_ID = gql`
  query Plan($id:ID!){
    plan(id:$id){
      id title description status version updatedAt
      days{
        id order title
```
- query Plans @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const PLANS_LIST = gql`
  query Plans($cursor:String, $limit:Int, $search:String){
    plans(cursor:$cursor, limit:$limit, search:$search){
      edges{ id title description status version updatedAt assignedCount }
      pageInfo{ endCursor hasNextPage }
      total
```
- mutation PublishPlan @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:44`
```ts
export const DUPLICATE_PLAN = gql`
  mutation DuplicatePlan($id:ID!){
    duplicatePlan(id:$id){ id title description status version }
  }
`;

export const PUBLISH_PLAN = gql`
  mutation PublishPlan($id:ID!){
    publishPlan(id:$id){ id status version updatedAt }
  }
`;
```
- mutation Refresh @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/auth.queries.ts:26`
```ts
refreshToken
      expiresAt
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation Refresh($refreshToken:String!){
    refresh(refreshToken:$refreshToken){
      token
      expiresAt
    }
```
- mutation RegisterCoach @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/auth.queries.ts:15`
```ts
refreshToken
      expiresAt
    }
  }
`;

export const REGISTER_COACH = gql`
  mutation RegisterCoach($input:RegisterInput!){
    register(input:$input){
      token
      coach { id email name role }
      refreshToken
```
- mutation SendAttachment @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/mutations/chat.mutations.ts:7`
```ts
import { gql } from "@apollo/client";
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) { id senderId receiverId content createdAt }
  }
`;
export const SEND_ATTACHMENT = gql`
  mutation SendAttachment($input: SendAttachmentInput!) {
    sendAttachment(input: $input) { id senderId receiverId attachmentId createdAt }
  }
`;
```
- mutation SendMessage @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/mutations/chat.mutations.ts:2`
```ts
import { gql } from "@apollo/client";
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) { id senderId receiverId content createdAt }
  }
`;
export const SEND_ATTACHMENT = gql`
```
- mutation UpdateAnalytics @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/analytics.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const UPDATE_ANALYTICS = gql`
  mutation UpdateAnalytics($input: AnalyticsInput!) {
    updateAnalytics(input: $input) { users }
  }
`;
```
- mutation UpdateUser @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/user.mutations.ts:10`
```ts
export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) { id }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $input: UserInput!) {
    updateUser(id: $id, input: $input) { id }
  }
`;
```
- mutation UpdateWallet @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/wallet.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const UPDATE_WALLET = gql`
  mutation UpdateWallet($id: Int!, $input: WalletInput!) {
    updateWallet(id: $id, input: $input) { id }
  }
`;
```
- mutation UpdateWorkout @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/workout.mutations.ts:16`
```ts
}
  }
`;

// Update an existing workout by its ID. Only provided fields in the
// input will be changed. Returns the updated workout ID.
export const UPDATE_WORKOUT = gql`
  mutation UpdateWorkout($id: Int!, $input: UpdateWorkoutInput!) {
    updateWorkout(id: $id, input: $input) {
      id
    }
  }
```
- mutation UpsertClient @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:27`
```ts
metrics { date weight bodyFat muscleMass }
      lastActiveAt
    }
  }
`;

export const UPSERT_CLIENT = gql`
  mutation UpsertClient($input:UpsertClientInput!){
    upsertClient(input:$input){ id name email avatar status }
  }
`;
```
- mutation UpsertPlan @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:30`
```ts
}
      }
    }
  }
`;

export const UPSERT_PLAN = gql`
  mutation UpsertPlan($input:UpsertPlanInput!){
    upsertPlan(input:$input){
      id title description status version updatedAt
    }
  }
```
- query UserReservations @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/queries/reservation.queries.ts:3`
```ts
import { gql } from "@apollo/client";

export const USER_RESERVATIONS = gql`
  query UserReservations($userId: String!) {
    userReservations(userId: $userId) {
      id coachId startsAt endsAt status createdAt
    }
  }
```
- query Workouts @ `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/web-core/src/hooks.ts:3`
```ts
import { gql, useQuery, useMutation } from '@apollo/client';

export const Q_WORKOUTS = gql`query Workouts{ workouts{ id name } }`;
export const M_CREATE_WORKOUT = gql`mutation CreateWorkout($input:WorkoutInput!){ createWorkout(input:$input){ id name } }`;
// NOTE: Map these to your exact backend schema.

export function useWorkouts(){
  const q = useQuery(Q_WORKOUTS);
```

## FULL MAP (server↔client)

### AddNote — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:39`
```ts
export const ARCHIVE_CLIENT = gql`
  mutation ArchiveClient($id:ID!){
    archiveClient(id:$id)
  }
`;

export const ADD_NOTE = gql`
  mutation AddNote($clientId:ID!, $body:String!){
    addClientNote(clientId:$clientId, body:$body){
      id body createdAt author { id name }
    }
  }
```

---
### Amount — UNUSED_SERVER_OP

**Server**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:23`
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
### ArchiveClient — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:33`
```ts
export const UPSERT_CLIENT = gql`
  mutation UpsertClient($input:UpsertClientInput!){
    upsertClient(input:$input){ id name email avatar status }
  }
`;

export const ARCHIVE_CLIENT = gql`
  mutation ArchiveClient($id:ID!){
    archiveClient(id:$id)
  }
`;
```

---
### AssignPlan — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:50`
```ts
export const PUBLISH_PLAN = gql`
  mutation PublishPlan($id:ID!){
    publishPlan(id:$id){ id status version updatedAt }
  }
`;

export const ASSIGN_PLAN = gql`
  mutation AssignPlan($planId:ID!, $clientId:ID!, $startDate:String!, $sessionsPerWeek:Int!, $restDays:[String!]!, $durationDays:Int!){
    assignPlan(planId:$planId, clientId:$clientId, startDate:$startDate, sessionsPerWeek:$sessionsPerWeek, restDays:$restDays, durationDays:$durationDays){ id planId clientId startDate sessionsPerWeek restDays durationDays }
  }
`;
```

---
### Authority — UNUSED_SERVER_OP

**Server**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:23`
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
### BookReservation — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/reservation.mutations.ts:3`
```ts
import { gql } from "@apollo/client";

export const BOOK_RESERVATION = gql`
  mutation BookReservation($input: CreateReservationInput!) {
    bookReservation(input: $input) { id coachId slotId status startsAt endsAt }
  }
`;
```

---
### CancelReservation — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/reservation.mutations.ts:9`
```ts
export const BOOK_RESERVATION = gql`
  mutation BookReservation($input: CreateReservationInput!) {
    bookReservation(input: $input) { id coachId slotId status startsAt endsAt }
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($id: String!) {
    cancelReservation(id: $id)
  }
`;
```

---
### Client — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:14`
```ts
pageInfo{ endCursor hasNextPage }
      total
    }
  }
`;

export const CLIENT_BY_ID = gql`
  query Client($id:ID!){
    client(id:$id){
      id name email avatar phone status height weight birthday
      goals { id title note createdAt }
      notes { id body createdAt author { id name } }
```

---
### ClientNotes — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:47`
```ts
addClientNote(clientId:$clientId, body:$body){
      id body createdAt author { id name }
    }
  }
`;

export const CLIENT_NOTES = gql`
  query ClientNotes($clientId:ID!, $cursor:String, $limit:Int){
    clientNotes(clientId:$clientId, cursor:$cursor, limit:$limit){
      edges{ id body createdAt author { id name } }
      pageInfo{ endCursor hasNextPage }
    }
```

---
### Clients — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const CLIENTS_LIST = gql`
  query Clients($search:String, $cursor:String, $limit:Int){
    clients(search:$search, cursor:$cursor, limit:$limit){
      edges{ id name email avatar status lastActiveAt }
      pageInfo{ endCursor hasNextPage }
      total
```

---
### CoachAvailability — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/availability.queries.ts:3`
```ts
import { gql } from "@apollo/client";

export const COACH_AVAILABILITY = gql`
  query CoachAvailability($coachId: String!) {
    coachAvailability(coachId: $coachId) {
      id coachId start end recurrence createdAt
    }
  }
```

---
### CoachReservations — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/availability.queries.ts:11`
```ts
coachAvailability(coachId: $coachId) {
      id coachId start end recurrence createdAt
    }
  }
`;

export const COACH_RESERVATIONS = gql`
  query CoachReservations($coachId: String!) {
    coachReservations(coachId: $coachId) {
      id userId startsAt endsAt status createdAt
    }
  }
```

---
### CreateAdmin — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/admin.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: AdminInput!) {
    createAdmin(input: $input) { id }
  }
`;
```

---
### CreateAvailability — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/mutations/availability.mutations.ts:3`
```ts
import { gql } from "@apollo/client";

export const CREATE_AVAILABILITY = gql`
  mutation CreateAvailability($input: CreateAvailabilityInput!) {
    createAvailability(input: $input) { id coachId start end recurrence }
  }
`;
```

---
### CreateChallenge — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/challenge.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_CHALLENGE = gql`
  mutation CreateChallenge($input: ChallengeInput!) {
    createChallenge(input: $input) { id }
  }
`;
```

---
### CreateCoach — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/coach.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_COACH = gql`
  mutation CreateCoach($input: CoachInput!) {
    createCoach(input: $input) { id }
  }
`;
```

---
### CreateNotification — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/notification.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: NotificationInput!) {
    createNotification(input: $input) { id }
  }
`;
```

---
### CreateNutritionPlan — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/nutrition.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_NUTRITION_PLAN = gql`
  mutation CreateNutritionPlan($input: NutritionPlanInput!) {
    createNutritionPlan(input: $input) { id }
  }
`;
```

---
### CreatePayment — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/payment.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: PaymentInput!) {
    createPayment(input: $input) { id }
  }
`;
```

---
### CreateProduct — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/product.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) { id }
  }
`;
```

---
### CreateReward — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/reward.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_REWARD = gql`
  mutation CreateReward($input: RewardInput!) {
    createReward(input: $input) { id }
  }
`;
```

---
### CreateSurvey — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/survey.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($input: SurveyInput!) {
    createSurvey(input: $input) { id }
  }
`;
```

---
### CreateUser — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/user.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) { id }
  }
`;
```

---
### CreateWorkout — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/web-core/src/hooks.ts:4`
```ts
import { gql, useQuery, useMutation } from '@apollo/client';

export const Q_WORKOUTS = gql`query Workouts{ workouts{ id name } }`;
export const M_CREATE_WORKOUT = gql`mutation CreateWorkout($input:WorkoutInput!){ createWorkout(input:$input){ id name } }`;
// NOTE: Map these to your exact backend schema.

export function useWorkouts(){
  const q = useQuery(Q_WORKOUTS);
  return q;
```

---
### DailySummary — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/queries/nutrition.queries.ts:3`
```ts
import { gql } from "@apollo/client";
export const FOOD_SEARCH = gql`query FoodSearch($q:String!){ foodSearch(q:$q){ id title protein carbs fat calories } }`;
export const DAILY_SUMMARY = gql`query DailySummary($userId:Int!, $dateISO:String!){ userDailyNutrition(userId:$userId, dateISO:$dateISO){ calories protein carbs fat } }`;
```

---
### DeleteUser — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/user.mutations.ts:16`
```ts
export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $input: UserInput!) {
    updateUser(id: $id, input: $input) { id }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;
```

---
### DeleteWorkout — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/workout.mutations.ts:25`
```ts
id
    }
  }
`;

// Delete a workout by its ID. Returns true if removed.
export const DELETE_WORKOUT = gql`
  mutation DeleteWorkout($id: Int!) {
    deleteWorkout(id: $id)
  }
`;
```

---
### DuplicatePlan — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:38`
```ts
upsertPlan(input:$input){
      id title description status version updatedAt
    }
  }
`;

export const DUPLICATE_PLAN = gql`
  mutation DuplicatePlan($id:ID!){
    duplicatePlan(id:$id){ id title description status version }
  }
`;
```

---
### Exercises — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:56`
```ts
export const ASSIGN_PLAN = gql`
  mutation AssignPlan($planId:ID!, $clientId:ID!, $startDate:String!, $sessionsPerWeek:Int!, $restDays:[String!]!, $durationDays:Int!){
    assignPlan(planId:$planId, clientId:$clientId, startDate:$startDate, sessionsPerWeek:$sessionsPerWeek, restDays:$restDays, durationDays:$durationDays){ id planId clientId startDate sessionsPerWeek restDays durationDays }
  }
`;

export const EXERCISE_LIBRARY = gql`
  query Exercises($search:String, $muscle:String, $equipment:String, $cursor:String, $limit:Int){
    exercises(search:$search, muscle:$muscle, equipment:$equipment, cursor:$cursor, limit:$limit){
      edges{ id name muscleGroup equipment media }
      pageInfo{ endCursor hasNextPage }
      total
```

---
### FoodSearch — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/queries/nutrition.queries.ts:2`
```ts
import { gql } from "@apollo/client";
export const FOOD_SEARCH = gql`query FoodSearch($q:String!){ foodSearch(q:$q){ id title protein carbs fat calories } }`;
export const DAILY_SUMMARY = gql`query DailySummary($userId:Int!, $dateISO:String!){ userDailyNutrition(userId:$userId, dateISO:$dateISO){ calories protein carbs fat } }`;
```

---
### GetAdmins — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/admin.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_ADMINS = gql`
  query GetAdmins {
    admins {
      id
      name
      email
```

---
### GetAnalytics — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/analytics.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_ANALYTICS = gql`
  query GetAnalytics {
    analytics {
      users
      payments
      challenges
```

---
### GetChallenge — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/challenge.queries.ts:14`
```ts
title
      participants
    }
  }
`;

export const GET_CHALLENGE = gql`
  query GetChallenge($id: Int!) {
    challenge(id: $id) {
      id
      title
      participants
```

---
### GetChallenges — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/challenge.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_CHALLENGES = gql`
  query GetChallenges {
    challenges {
      id
      title
      participants
```

---
### GetChat — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/chat.queries.ts:2`
```ts
import { gql } from "@apollo/client";
export const GET_CHAT = gql`
  query GetChat($userA:Int!, $userB:Int!) {
    getChat(userA:$userA, userB:$userB) {
      id senderId receiverId content attachmentId createdAt
    }
  }
```

---
### GetCoach — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/coach.queries.ts:14`
```ts
name
      email
    }
  }
`;

export const GET_COACH = gql`
  query GetCoach($id: Int!) {
    coach(id: $id) {
      id
      name
      email
```

---
### GetCoaches — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/coach.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_COACHES = gql`
  query GetCoaches {
    coaches {
      id
      name
      email
```

---
### GetNotifications — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/notification.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      text
      createdAt
```

---
### GetNutritionPlans — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/nutrition.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_NUTRITION_PLANS = gql`
  query GetNutritionPlans {
    nutritionPlans {
      id
      title
      calories
```

---
### GetPayment — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/payment.queries.ts:15`
```ts
amount
      status
    }
  }
`;

export const GET_PAYMENT = gql`
  query GetPayment($id: Int!) {
    payment(id: $id) {
      id
      user
      amount
```

---
### GetPayments — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/payment.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      user
      amount
```

---
### GetProducts — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/product.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      price
```

---
### GetRewards — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/reward.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_REWARDS = gql`
  query GetRewards {
    rewards {
      id
      title
      xp
```

---
### GetSurveys — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/survey.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_SURVEYS = gql`
  query GetSurveys {
    surveys {
      id
      question
    }
```

---
### GetUser — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/user.queries.ts:15`
```ts
email
      role
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      name
      email
```

---
### GetUserWorkouts — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/workout.queries.ts:40`
```ts
userId
    }
  }
`;

// Fetch workouts for a specific user.
export const GET_USER_WORKOUTS = gql`
  query GetUserWorkouts($userId: Int!) {
    userWorkouts(userId: $userId) {
      id
      title
      duration
```

---
### GetUsers — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/user.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
```

---
### GetWallets — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/wallet.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const GET_WALLETS = gql`
  query GetWallets {
    wallets {
      id
      user
      balance
```

---
### GetWorkout — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/workout.queries.ts:22`
```ts
mediaUrl
      userId
    }
  }
`;

export const GET_WORKOUT = gql`
  query GetWorkout($id: Int!) {
    workout(id: $id) {
      id
      title
      duration
```

---
### GetWorkouts — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/queries/workout.queries.ts:5`
```ts
import { gql } from "@apollo/client";

// Fetch all workouts across all users. Use sparingly in admin dashboards.
export const GET_WORKOUTS = gql`
  query GetWorkouts {
    workouts {
      id
      title
      duration
```

---
### LogActualWorkout — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/workout.mutations.ts:34`
```ts
}
`;

// Log the actual performance data for a workout. Accepts the workout ID
// and an UpdateWorkoutInput containing metrics like sets, reps, weight, RPE,
// notes and mediaUrl. Returns the updated workout ID.
export const LOG_ACTUAL_WORKOUT = gql`
  mutation LogActualWorkout($id: Int!, $input: UpdateWorkoutInput!) {
    logActual(id: $id, input: $input) {
      id
    }
  }
```

---
### LogMeal — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/nutrition.mutations.ts:2`
```ts
import { gql } from "@apollo/client";
export const LOG_MEAL = gql`mutation LogMeal($input:LogMealInput!){ logMeal(input:$input){ id userId foodId grams createdAt } }`;
```

---
### LoginCoach — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/auth.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const LOGIN_COACH = gql`
  mutation LoginCoach($email:String!,$password:String!){
    login(email:$email, password:$password){
      token
      coach { id email name role }
      refreshToken
```

---
### MarkAllNotificationsRead — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/notification.mutations.ts:9`
```ts
export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: Int!) {
    markNotificationRead(id: $id) { id read text createdAt }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead($userId: Int!) {
    markAllNotificationsRead(userId: $userId)
  }
`;
```

---
### MarkNotificationRead — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/notification.mutations.ts:3`
```ts
import { gql } from "@apollo/client";

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: Int!) {
    markNotificationRead(id: $id) { id read text createdAt }
  }
`;
```

---
### MessageReceived — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/subscriptions/chat.subs.ts:2`
```ts
import { gql } from "@apollo/client";
export const MESSAGE_RECEIVED = gql`
  subscription MessageReceived($userId: Int!) {
    messageReceived(userId: $userId) { id senderId receiverId content attachmentId createdAt }
  }
`;
```

---
### NotificationReceived — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/subscriptions/notification.subs.ts:3`
```ts
import { gql } from "@apollo/client";

export const NOTIFICATION_RECEIVED = gql`
  subscription NotificationReceived($userId: Int!) {
    notificationReceived(userId: $userId) {
      id
      text
      read
```

---
### Plan — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:14`
```ts
pageInfo{ endCursor hasNextPage }
      total
    }
  }
`;

export const PLAN_BY_ID = gql`
  query Plan($id:ID!){
    plan(id:$id){
      id title description status version updatedAt
      days{
        id order title
```

---
### Plans — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:4`
```ts
import { gql } from "@apollo/client";

export const PLANS_LIST = gql`
  query Plans($cursor:String, $limit:Int, $search:String){
    plans(cursor:$cursor, limit:$limit, search:$search){
      edges{ id title description status version updatedAt assignedCount }
      pageInfo{ endCursor hasNextPage }
      total
```

---
### PublishPlan — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:44`
```ts
export const DUPLICATE_PLAN = gql`
  mutation DuplicatePlan($id:ID!){
    duplicatePlan(id:$id){ id title description status version }
  }
`;

export const PUBLISH_PLAN = gql`
  mutation PublishPlan($id:ID!){
    publishPlan(id:$id){ id status version updatedAt }
  }
`;
```

---
### Refresh — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/auth.queries.ts:26`
```ts
refreshToken
      expiresAt
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation Refresh($refreshToken:String!){
    refresh(refreshToken:$refreshToken){
      token
      expiresAt
    }
```

---
### RegisterCoach — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/auth.queries.ts:15`
```ts
refreshToken
      expiresAt
    }
  }
`;

export const REGISTER_COACH = gql`
  mutation RegisterCoach($input:RegisterInput!){
    register(input:$input){
      token
      coach { id email name role }
      refreshToken
```

---
### SendAttachment — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/mutations/chat.mutations.ts:7`
```ts
import { gql } from "@apollo/client";
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) { id senderId receiverId content createdAt }
  }
`;
export const SEND_ATTACHMENT = gql`
  mutation SendAttachment($input: SendAttachmentInput!) {
    sendAttachment(input: $input) { id senderId receiverId attachmentId createdAt }
  }
`;
```

---
### SendMessage — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/mutations/chat.mutations.ts:2`
```ts
import { gql } from "@apollo/client";
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) { id senderId receiverId content createdAt }
  }
`;
export const SEND_ATTACHMENT = gql`
```

---
### UpdateAnalytics — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/analytics.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const UPDATE_ANALYTICS = gql`
  mutation UpdateAnalytics($input: AnalyticsInput!) {
    updateAnalytics(input: $input) { users }
  }
`;
```

---
### UpdateUser — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/user.mutations.ts:10`
```ts
export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) { id }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $input: UserInput!) {
    updateUser(id: $id, input: $input) { id }
  }
`;
```

---
### UpdateWallet — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/wallet.mutations.ts:4`
```ts
import { gql } from "@apollo/client";

export const UPDATE_WALLET = gql`
  mutation UpdateWallet($id: Int!, $input: WalletInput!) {
    updateWallet(id: $id, input: $input) { id }
  }
`;
```

---
### UpdateWorkout — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/workout.mutations.ts:16`
```ts
}
  }
`;

// Update an existing workout by its ID. Only provided fields in the
// input will be changed. Returns the updated workout ID.
export const UPDATE_WORKOUT = gql`
  mutation UpdateWorkout($id: Int!, $input: UpdateWorkoutInput!) {
    updateWorkout(id: $id, input: $input) {
      id
    }
  }
```

---
### UpsertClient — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:27`
```ts
metrics { date weight bodyFat muscleMass }
      lastActiveAt
    }
  }
`;

export const UPSERT_CLIENT = gql`
  mutation UpsertClient($input:UpsertClientInput!){
    upsertClient(input:$input){ id name email avatar status }
  }
`;
```

---
### UpsertPlan — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:30`
```ts
}
      }
    }
  }
`;

export const UPSERT_PLAN = gql`
  mutation UpsertPlan($input:UpsertPlanInput!){
    upsertPlan(input:$input){
      id title description status version updatedAt
    }
  }
```

---
### UserReservations — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/queries/reservation.queries.ts:3`
```ts
import { gql } from "@apollo/client";

export const USER_RESERVATIONS = gql`
  query UserReservations($userId: String!) {
    userReservations(userId: $userId) {
      id coachId startsAt endsAt status createdAt
    }
  }
```

---
### Workouts — UNRESOLVED_CLIENT_OP

**Client**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/web-core/src/hooks.ts:3`
```ts
import { gql, useQuery, useMutation } from '@apollo/client';

export const Q_WORKOUTS = gql`query Workouts{ workouts{ id name } }`;
export const M_CREATE_WORKOUT = gql`mutation CreateWorkout($input:WorkoutInput!){ createWorkout(input:$input){ id name } }`;
// NOTE: Map these to your exact backend schema.

export function useWorkouts(){
  const q = useQuery(Q_WORKOUTS);
```

---
### cursor — UNUSED_SERVER_OP

**Server**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/payments.controller.ts:28`
```ts
const res = await (this.payments as any).create({ ...body, idempotencyKey: body.idempotencyKey || idem || undefined });
    return { ok: true, data: res };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listMine(@Query() q: ListPaymentsDto, @Headers('x-user-id') xUser?: string) limit = '20', @Query('cursor') cursor?: string, @Headers('x-user-id') xUser?: string) {
    // Try to read from auth context if available; fallback to header for demo
    const userId = xUser || 'demo-user';
    if (typeof (this.payments as any).listByUser === 'function') {
      const out = await (this.payments as any).listByUser({ userId, limit: Number(q?.limit||20), cursor: q?.cursor });
      return { ok: true, data: out.items, nextCursor: out.nextCursor };
```

---
### q — UNUSED_SERVER_OP

**Server**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:12`
```ts
@ApiBearerAuth()
@Controller('workouts')
export class Workouts_serviceController {
  constructor(private readonly svc: WorkoutsService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

  @Post()
  create(@Body() dto: any) {
```

---
### t — UNUSED_SERVER_OP

**Server**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/certificate/certificate.controller.ts:18`
```ts
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
### userId — UNUSED_SERVER_OP

**Server**:
- `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/bff-web/bff-web.controller.ts:8`
```ts
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
    return { user: { id: user?.id, name: user?.name }, recentWorkouts: workouts };
```

---
