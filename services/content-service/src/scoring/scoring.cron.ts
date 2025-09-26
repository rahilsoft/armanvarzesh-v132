
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Injectable()
export class ScoringCron implements OnModuleInit {
  private readonly logger = new Logger('ScoringCron');
  constructor(private readonly scoring: ScoringService){}
  onModuleInit(){
    // every 6 hours
    setInterval(async ()=>{
      try{ await this.scoring.recomputeAll(); this.logger.log('recomputeAll done'); }catch(e){ this.logger.error(e as any); }
    }, 6*60*60*1000);
  }
}
