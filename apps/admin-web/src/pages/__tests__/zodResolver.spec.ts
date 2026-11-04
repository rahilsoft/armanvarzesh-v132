import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// zod 4 needs @hookform/resolvers >= 5.1. With 3.x the resolver rejects with a raw
// ZodError instead of returning field errors, so form validation messages never render.
describe('zodResolver with zod 4', () => {
  const schema = z.object({
    email: z.string().email('ایمیل معتبر نیست'),
    name: z.string().min(2),
  });

  it('returns field errors for invalid input', async () => {
    const result = await zodResolver(schema)(
      { email: 'x', name: 'a' },
      undefined,
      { fields: {}, shouldUseNativeValidation: false },
    );
    expect(result.values).toEqual({});
    expect(result.errors.email?.message).toBe('ایمیل معتبر نیست');
    expect(result.errors.name).toBeDefined();
  });

  it('returns values for valid input', async () => {
    const result = await zodResolver(schema)(
      { email: 'a@b.co', name: 'Ali' },
      undefined,
      { fields: {}, shouldUseNativeValidation: false },
    );
    expect(result.errors).toEqual({});
    expect(result.values).toEqual({ email: 'a@b.co', name: 'Ali' });
  });
});
