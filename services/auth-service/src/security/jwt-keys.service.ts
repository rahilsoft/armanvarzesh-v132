import { Injectable } from '@nestjs/common';

/**
 * Simple JWT key rotation scaffold.
 * - JWT_SECRETS: comma-separated list or JSON array of secrets
 * - JWT_ACTIVE_KID: key id of the active secret
 */
@Injectable()
export class JwtKeysService {
  private secrets: Record<string,string> = {};
  private activeKid: string | null = null;

  constructor() {
    const raw = process.env.JWT_SECRETS || '';
    const asArray = this.parseSecrets(raw);
    asArray.forEach((s, idx) => {
      const kid = `k${idx+1}`;
      this.secrets[kid] = s;
    });
    this.activeKid = process.env.JWT_ACTIVE_KID || (Object.keys(this.secrets)[0] || null);
  }

  private parseSecrets(raw: string): string[] {
    if (!raw) return [];
    try {
      const j = JSON.parse(raw);
      if (Array.isArray(j)) return j.map(String);
    } catch {}
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  }

  getActive() {
    if (!this.activeKid) return null;
    return { kid: this.activeKid, secret: this.secrets[this.activeKid] };
  }

  resolveByKid(kid: string) {
    if (!kid) return null;
    const secret = this.secrets[kid];
    if (!secret) return null;
    return { kid, secret };
  }

  listKids(): string[] {
    return Object.keys(this.secrets);
  }
}