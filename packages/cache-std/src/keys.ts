export const ns = (svc: string, domain: string, ...parts: (string|number)[]) =>
  [svc, domain, ...parts].join(':');

export const Keys = {
  user: (id: number|string) => ns('svc', 'user', id),
  workout: (id: number|string) => ns('svc', 'workout', id),
};
