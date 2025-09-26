
import { Injectable } from '@nestjs/common';
import { PrismaClient, ServiceType } from '@prisma/client';

type Weights = {
  followup:number;
  multimodal:number;
  biweekly:number;
  endterm:number;
  renewal:number;
  goalFocus:number;
  freeToPremium:number;
  contentQuality:number;
  responsiveness:number;
  baselineBoost:number;
};

@Injectable()
export class ScoringService {
  public defaultWeights: Weights = {
    followup: 0.18,
    multimodal: 0.08,
    biweekly: 0.14,
    endterm: 0.18,
    renewal: 0.14,
    goalFocus: 0.08,
    freeToPremium: 0.12,
    contentQuality: 0.06,
    responsiveness: 0.02,
    baselineBoost: 0.00,
  };
  private prisma = new PrismaClient();

  async getWeightsFor(role: ServiceType){
    const w = await this.prisma.scoringWeights.findUnique({ where:{ role } });
    return (w?.weights as any) || this.defaultWeights;
  }

  async computeFor(specialistId: string, role: ServiceType){
    const w = await this.getWeightsFor(role);
    const now = new Date();
    const since = new Date(now.getTime() - 1000*60*60*24*90); // 90-day lookback

    // 1) followup
    const msgs = await this.prisma.chatMessage.findMany({
      where:{ senderId: specialistId, createdAt:{ gte: since } }
    });
    const followup = Math.min(1, msgs.length / 200);

    // 2) multimodal
    const multimodalCount = await this.prisma.chatMessage.count({ where:{ senderId: specialistId, voiceUrl: { not: null }, createdAt:{ gte: since } } });
    const multimodal = msgs.length ? Math.min(1, multimodalCount / msgs.length) : 0;

    // 3) biweekly survey
    const biweeklyRes = await this.prisma.surveyResponse.findMany({ where:{ specialistId, templateCode:'BIWEEKLY', createdAt:{ gte: since } } });
    const biweekly = biweeklyRes.length ? (biweeklyRes.reduce((a,b)=> a + (b.rating||0), 0) / (biweeklyRes.length*5)) : 0;

    // 4) end-term survey
    const endRes = await this.prisma.surveyResponse.findMany({ where:{ specialistId, templateCode:'END_OF_TERM', createdAt:{ gte: since } } });
    const endterm = endRes.length ? (endRes.reduce((a,b)=> a + (b.rating||0), 0) / (endRes.length*5)) : 0;

    // 5) renewal rate
    const renewals = await this.prisma.conversionEvent.count({ where:{ specialistId, serviceType: role, kind:'RENEWAL', at:{ gte: since } } });
    const uniqueUsers = await this.prisma.lead.findMany({ where:{ specialistId, serviceType: role, createdAt:{ gte: since } }, select:{ userId:true } });
    const usersSet = new Set(uniqueUsers.map(x=> x.userId));
    const renewal = usersSet.size ? Math.min(1, renewals / usersSet.size) : 0;

    // 6) goal focus
    const plans = await this.prisma.plan.findMany({ where:{ createdBy: specialistId, createdAt:{ gte: since } } as any });
    const withGoal = plans.filter((p:any)=> String(p.json||'').includes('goal')).length;
    const goalFocus = plans.length ? (withGoal / plans.length) : 0;

    // 7) free→premium conversion
    const conv = await this.prisma.conversionEvent.count({ where:{ specialistId, serviceType: role, kind:'FREE_TO_PREMIUM', at:{ gte: since } } });
    const leads = await this.prisma.lead.count({ where:{ specialistId, serviceType: role, createdAt:{ gte: since } } });
    const freeToPremium = leads ? Math.min(1, conv / leads) : 0;

    // 8) content quality (approved corrective videos as proxy)
    const videos = await this.prisma.correctiveVideo.count({ where:{ uploadedBy: specialistId, status: 'APPROVED' } });
    const contentQuality = Math.min(1, videos / 100);

    // 9) responsiveness
    const msgs24 = await this.prisma.chatMessage.count({ where:{ senderId: specialistId, createdAt:{ gte: new Date(now.getTime()-1000*60*60*24) } } });
    const msgs7d  = await this.prisma.chatMessage.count({ where:{ senderId: specialistId, createdAt:{ gte: new Date(now.getTime()-1000*60*60*24*7) } } });
    const responsiveness = msgs7d ? Math.min(1, (msgs24/msgs7d)*3) : 0;

    // baseline for newcomers
    const hasUsers = await this.prisma.lead.count({ where:{ specialistId, serviceType: role } });
    const baselineBoost = hasUsers ? 0 : 0.25;

    const total = (
      w.followup*followup +
      w.multimodal*multimodal +
      w.biweekly*biweekly +
      w.endterm*endterm +
      w.renewal*renewal +
      w.goalFocus*goalFocus +
      w.freeToPremium*freeToPremium +
      w.contentQuality*contentQuality +
      w.responsiveness*responsiveness +
      (w.baselineBoost||0)*baselineBoost
    );

    const metrics = { followup, multimodal, biweekly, endterm, renewal, goalFocus, freeToPremium, contentQuality, responsiveness, baselineBoost };
    await this.prisma.specialistScore.upsert({
      where:{ specialistId },
      update:{ role, totalScore: total, metrics, lastComputed: new Date() },
      create:{ specialistId, role, totalScore: total, metrics, lastComputed: new Date() }
    });
    await this.prisma.specialistScoreHistory.create({ data:{ specialistId, role, totalScore: total, metrics } });
    return { total, metrics };
  }

  async topByRole(role: ServiceType, limit=3){
    const rows = await this.prisma.specialistScore.findMany({ where:{ role }, orderBy:{ totalScore: 'desc' }, take: limit });
    return rows;
  }

  async recomputeAll(){
    const ids = new Set<string>();
    const rows1 = await this.prisma.specialistScore.findMany({ select:{ specialistId:true, role:true } });
    rows1.forEach(r=> ids.add(`${r.specialistId}|${r.role}`));
    const rows2 = await this.prisma.lead.findMany({ select:{ specialistId:true, serviceType:true } });
    rows2.forEach(r=> ids.add(`${r.specialistId}|${r.serviceType}`));
    for (const k of ids){
      const [specialistId, role] = k.split('|');
      await this.computeFor(specialistId, role as ServiceType);
    }
    return ids.size;
  }
}
