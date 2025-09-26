import { Injectable } from '@nestjs/common';

export interface Affiliate {
  id: number;
  code: string;
  userId: number;
  refCount: number;
  createdAt: Date;
}

/**
 * AffiliateService manages referral codes for users. Data is stored in memory for demonstration.
 */
@Injectable()
export class AffiliateService {
  private affiliates: Affiliate[] = [];
  private idCounter = 1;

  createAffiliate(userId: number): Affiliate {
    const code = `AFF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const affiliate: Affiliate = {
      id: this.idCounter++,
      code,
      userId,
      refCount: 0,
      createdAt: new Date(),
    };
    this.affiliates.push(affiliate);
    return affiliate;
  }

  listAffiliates(): Affiliate[] {
    return this.affiliates;
  }

  getAffiliateByCode(code: string): Affiliate | undefined {
    return this.affiliates.find(a => a.code === code);
  }

  incrementRefCount(code: string): Affiliate {
    const aff = this.affiliates.find(a => a.code === code);
    if (!aff) throw new Error('Affiliate code not found');
    aff.refCount += 1;
    return aff;
  }
}