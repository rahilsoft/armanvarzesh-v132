import type { MealEntry, MealPlan } from '@contracts/nutrition';
import type { UserPreference } from '@contracts/notifications';

export class SDK {
  constructor(private baseUrl: string, private getHeaders: ()=>Record<string,string> = ()=>({'content-type':'application/json'})) {}

  // Nutrition
  async getMealPlan(userId: string): Promise<MealPlan|null> {
    const r = await fetch(`${this.baseUrl}/nutrition/v1/users/${encodeURIComponent(userId)}/meal-plan`, { headers: this.getHeaders() });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`getMealPlan failed: ${r.status}`);
    return await r.json();
  }
  async setMealPlan(userId: string, plan: MealPlan): Promise<void> {
    const r = await fetch(`${this.baseUrl}/nutrition/v1/users/${encodeURIComponent(userId)}/meal-plan`, {
      method: 'PUT', headers: this.getHeaders(), body: JSON.stringify(plan)
    });
    if (!r.ok) throw new Error(`setMealPlan failed: ${r.status}`);
  }
  async addMealEntry(userId: string, entry: MealEntry): Promise<void> {
    const r = await fetch(`${this.baseUrl}/nutrition/v1/users/${encodeURIComponent(userId)}/meals`, {
      method: 'POST', headers: this.getHeaders(), body: JSON.stringify(entry)
    });
    if (!r.ok) throw new Error(`addMealEntry failed: ${r.status}`);
  }

  // Notifications
  async getPreferences(userId: string): Promise<UserPreference> {
    const r = await fetch(`${this.baseUrl}/notifications/v1/users/${encodeURIComponent(userId)}/preferences`, { headers: this.getHeaders() });
    if (!r.ok) throw new Error(`getPreferences failed: ${r.status}`);
    return await r.json();
  }
  async setPreferences(userId: string, pref: UserPreference): Promise<void> {
    const r = await fetch(`${this.baseUrl}/notifications/v1/users/${encodeURIComponent(userId)}/preferences`, {
      method: 'PUT', headers: this.getHeaders(), body: JSON.stringify(pref)
    });
    if (!r.ok) throw new Error(`setPreferences failed: ${r.status}`);
  }
}

async listMeals(userId: string, from?: string, to?: string): Promise<MealEntry[]> {
  const qs = new URLSearchParams(); if (from) qs.set('from', from); if (to) qs.set('to', to);
  const r = await fetch(`${this.baseUrl}/nutrition/v1/users/${encodeURIComponent(userId)}/meals?${qs.toString()}`, { headers: this.getHeaders() });
  if (!r.ok) throw new Error(`listMeals failed: ${r.status}`);
  return await r.json();
}

async getDailyMacros(userId: string, date: string): Promise<MacroTargets> {
  const r = await fetch(`${this.baseUrl}/nutrition/v1/users/${encodeURIComponent(userId)}/macros?date=${encodeURIComponent(date)}`, { headers: this.getHeaders() });
  if (!r.ok) throw new Error(`getDailyMacros failed: ${r.status}`);
  return await r.json();
}

// Payments
async startCheckout(userId: string, priceId: string, successUrl: string, cancelUrl: string): Promise<{url:string, sessionId:string}> {
  const r = await fetch(`${this.baseUrl}/payments/v1/checkout/session`, {
    method: 'POST', headers: this.getHeaders(), body: JSON.stringify({ userId, priceId, successUrl, cancelUrl })
  });
  if (!r.ok) throw new Error(`startCheckout failed: ${r.status}`);
  return await r.json();
}

async getSubscription(userId: string): Promise<{ userId: string; status: string }> {
  const r = await fetch(`${this.baseUrl}/payments/v1/users/${encodeURIComponent(userId)}/subscription`, { headers: this.getHeaders() });
  if (!r.ok) throw new Error(`getSubscription failed: ${r.status}`);
  return await r.json();
}
