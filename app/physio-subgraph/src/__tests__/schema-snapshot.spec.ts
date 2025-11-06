import { print } from 'graphql';
import { typeDefs } from '../schema';

test('SDL snapshot', ()=>{
  expect(print(typeDefs)).toMatchSnapshot();
});
