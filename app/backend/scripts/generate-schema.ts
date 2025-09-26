import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import helmet from "helmet";

async function run() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // GraphQLModule with autoSchemaFile will emit schema.gql on init
  await app.init();
  await app.close();
  // eslint-disable-next-line no-console
  console.log('✅ schema.gql emitted.');
}
run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('schema:emit failed', e);
  process.exit(1);
});