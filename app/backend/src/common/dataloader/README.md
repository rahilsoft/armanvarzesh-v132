# N+1 prevention with DataLoader (Phase J)
Example in a resolver:
```ts
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly loaderFactory: LoaderFactory) {}
  private userById = this.loaderFactory.createLoader<string, User>(async (ids) => {
    const users = await this.userService.findManyByIds(ids as string[]);
    const map = new Map(users.map(u => [u.id, u]));
    return ids.map(id => map.get(id));
  });
  @ResolveField(() => User)
  createdBy(@Parent() obj: Post) {
    return this.userById.load(obj.createdById);
  }
}
```
