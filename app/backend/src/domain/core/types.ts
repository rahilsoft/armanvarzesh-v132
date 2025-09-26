/** Domain Core Types (Phase 2 — Step 9) */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type UniqueEntityID = Brand<string, 'UniqueEntityID'>;
export function toID(id: string): UniqueEntityID { return id as UniqueEntityID; }

export abstract class Entity<TProps> {
  protected readonly _id: UniqueEntityID;
  protected props: TProps;
  protected constructor(props: TProps, id: UniqueEntityID) {
    this._id = id;
    this.props = props;
  }
  get id(): UniqueEntityID { return this._id; }
}
