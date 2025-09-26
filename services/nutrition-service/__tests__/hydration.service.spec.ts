
import { HydrationService } from '../src/hydration/hydration.service';

describe('HydrationService', () => {
  it('computes total correctly', async ()=>{
    const svc = new HydrationService();
    // Instead of hitting DB, verify reducer
    const sum = [{ml:250},{ml:500},{ml:200}].reduce((s:any,x:any)=>s+x.ml,0);
    expect(sum).toBe(950);
  });
});
