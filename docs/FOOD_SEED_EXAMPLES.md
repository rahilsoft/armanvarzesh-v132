# Food Seed Examples
Use these to quickly seed foods:
```graphql
mutation {
  a: createFood(input:{ title:"سینه مرغ پخته", protein:31, carbs:0, fat:3.6, calories:165 }) { id }
  b: createFood(input:{ title:"برنج سفید پخته", protein:2.7, carbs:28, fat:0.3, calories:130 }) { id }
  c: createFood(input:{ title:"آووکادو", protein:2, carbs:9, fat:15, calories:160 }) { id }
}
```
