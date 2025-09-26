import type { Config } from 'jest';
const config: Config = { preset:'ts-jest', testEnvironment:'node', roots:['<rootDir>/src','<rootDir>/test'], moduleFileExtensions:['ts','js','json'], collectCoverageFrom:['src/**/*.ts','!src/main.ts','!src/**/graphql/dataloader.ts','!src/**/tracing.ts','!src/**/*.module.ts'], coverageThreshold:{ global:{ branches:70, functions:75, lines:80, statements:80 } } };
export default config;
