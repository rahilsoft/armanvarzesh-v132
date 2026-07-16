// @arman/observability is an optional runtime integration: server.ts imports
// it dynamically inside try/catch and carries on when it is absent. This
// ambient declaration keeps typecheck independent of whether that package's
// dist has been built yet (CI typechecks without building dependencies).
declare module '@arman/observability' {
  export function setupObservability(): Promise<void> | void;
}
