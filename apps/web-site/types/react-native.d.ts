// The web vitrine does not run React Native, but a few shared components in
// @arman/ui are authored against react-native primitives. Declare the module
// as ambient/untyped so those files type-check within the web program without
// pulling the full react-native type surface (the deprecated @types/react-native
// stub ships no index.d.ts and breaks tsc auto type inclusion).
declare module 'react-native';
