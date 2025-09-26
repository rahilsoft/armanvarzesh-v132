import { typeDefs } from '../schema';
test('SDL snapshot', ()=>{
  expect(String(typeDefs)).toMatchSnapshot();
});
