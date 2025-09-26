import { typeDefs } from '../schema';
test('schema includes Physio types', ()=>{
  const sdl = String(typeDefs);
  expect(sdl).toContain('type PhysioProtocol');
  expect(sdl).toContain('type Query');
  expect(sdl).toContain('Mutation');
});
