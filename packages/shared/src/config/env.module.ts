import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './env.schema';
import { z } from 'zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = EnvSchema.safeParse(config);
        if (!parsed.success) {
          const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
          throw new Error('Env validation failed: ' + issues);
        }
        return parsed.data;
      },
    }),
  ],
})
export class EnvValidationModule {}