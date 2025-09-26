import { ok, err } from '../../result';
describe('result utils', () => { it('ok wraps data', () => { expect(ok(42)).toEqual({ ok: true, data: 42 }); }); it('err wraps message', () => { expect(err('boom')).toEqual({ ok: false, error: 'boom', details: undefined }); }); });
