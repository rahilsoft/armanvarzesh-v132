// Temporary: proves CI Matrix turns red on a failing test (REV-20261021-04). Branch is deleted after the run.
describe('red proof', () => { it('fails on purpose', () => { expect(1).toBe(2); }); });
