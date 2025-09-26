
import { Test, TestingModule } from '@nestjs/testing';
import { CoachService } from '../../src/coaches/coach.service';
import { ChallengeService } from '../../src/challenges/challenge.service';

describe('Coach-Challenge Integration', () => {
  let coachService: CoachService;
  let challengeService: ChallengeService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachService, ChallengeService],
    }).compile();
    coachService = module.get<CoachService>(CoachService);
    challengeService = module.get<ChallengeService>(ChallengeService);
  });

  it('should assign challenge to coach', async () => {
    const coach = await coachService.findByEmail('coach@example.com');
    const challenge = await challengeService.create({ title: "Spring Challenge" });
    await coachService.assignChallenge(coach.id, challenge.id);
    const challenges = await coachService.getCoachChallenges(coach.id);
    expect(challenges).toContainEqual(expect.objectContaining({ title: "Spring Challenge" }));
  });
});
