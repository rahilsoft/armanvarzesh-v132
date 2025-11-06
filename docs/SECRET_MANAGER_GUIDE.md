# راهنمای استفاده از Secret Manager

این سند راهنمای جامع برای استفاده از Secret Managers ابری در پروژه آرمان ورزش است.

## چرا Secret Manager؟

استفاده از Secret Manager برای مدیریت رازها و اطلاعات حساس مزایای زیر را دارد:

- ✅ **امنیت بالاتر**: رازها در محیط رمزنگاری شده ذخیره می‌شوند
- ✅ **مدیریت متمرکز**: همه رازها در یک مکان قابل مدیریت هستند
- ✅ **Rotation خودکار**: امکان تغییر خودکار رازها
- ✅ **Audit Trail**: ردیابی کامل دسترسی‌ها
- ✅ **جداسازی محیط**: رازهای Dev/Staging/Production جدا هستند

## پلتفرم‌های پشتیبانی شده

### ۱. AWS Secrets Manager

#### راه‌اندازی

```bash
# نصب AWS SDK
pnpm add @aws-sdk/client-secrets-manager

# تنظیم credentials (یکی از روش‌های زیر)
# Option 1: AWS CLI
aws configure

# Option 2: Environment Variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"
```

#### ایجاد Secret

```bash
# از طریق AWS CLI
aws secretsmanager create-secret \
  --name arman/production/database \
  --description "Production database credentials" \
  --secret-string '{"username":"dbuser","password":"SecureP@ss123","host":"db.example.com"}'

# با Rotation خودکار (30 روز)
aws secretsmanager create-secret \
  --name arman/production/jwt-secret \
  --secret-string "your-super-secret-jwt-key" \
  --rotation-rules AutomaticallyAfterDays=30
```

#### استفاده در کد

```typescript
// packages/secrets-manager/src/aws-secrets.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export class AWSSecretsManager {
  private client: SecretsManagerClient;

  constructor(region: string = process.env.AWS_REGION || 'us-east-1') {
    this.client = new SecretsManagerClient({ region });
  }

  async getSecret(secretName: string): Promise<any> {
    try {
      const command = new GetSecretValueCommand({ SecretId: secretName });
      const response = await this.client.send(command);

      if (response.SecretString) {
        return JSON.parse(response.SecretString);
      }

      throw new Error('Secret not found or is binary');
    } catch (error) {
      console.error(`Error retrieving secret ${secretName}:`, error);
      throw error;
    }
  }

  async getSecretValue(secretName: string, key?: string): Promise<string> {
    const secret = await this.getSecret(secretName);

    if (key) {
      return secret[key];
    }

    return typeof secret === 'string' ? secret : JSON.stringify(secret);
  }
}

// استفاده
const secretsManager = new AWSSecretsManager();
const dbConfig = await secretsManager.getSecret('arman/production/database');
const jwtSecret = await secretsManager.getSecretValue('arman/production/jwt-secret');
```

### ۲. Google Cloud Secret Manager

#### راه‌اندازی

```bash
# نصب Google Cloud SDK
pnpm add @google-cloud/secret-manager

# Authentication
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

#### ایجاد Secret

```bash
# از طریق gcloud CLI
echo -n "my-secret-value" | gcloud secrets create jwt-secret \
  --data-file=- \
  --replication-policy="automatic"

# با version جدید
echo -n "new-value" | gcloud secrets versions add jwt-secret \
  --data-file=-
```

#### استفاده در کد

```typescript
// packages/secrets-manager/src/gcp-secrets.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export class GCPSecretsManager {
  private client: SecretManagerServiceClient;
  private projectId: string;

  constructor(projectId?: string) {
    this.client = new SecretManagerServiceClient();
    this.projectId = projectId || process.env.GCP_PROJECT_ID || '';
  }

  async getSecret(secretName: string, version: string = 'latest'): Promise<string> {
    try {
      const name = `projects/${this.projectId}/secrets/${secretName}/versions/${version}`;
      const [response] = await this.client.accessSecretVersion({ name });

      const payload = response.payload?.data?.toString();
      if (!payload) {
        throw new Error('Secret payload is empty');
      }

      return payload;
    } catch (error) {
      console.error(`Error retrieving secret ${secretName}:`, error);
      throw error;
    }
  }

  async getSecretJSON(secretName: string): Promise<any> {
    const secret = await this.getSecret(secretName);
    return JSON.parse(secret);
  }
}

// استفاده
const secretsManager = new GCPSecretsManager('my-project-id');
const jwtSecret = await secretsManager.getSecret('jwt-secret');
const dbConfig = await secretsManager.getSecretJSON('database-config');
```

### ۳. HashiCorp Vault

#### راه‌اندازی

```bash
# نصب Vault client
pnpm add node-vault

# تنظیم Vault
export VAULT_ADDR="https://vault.example.com:8200"
export VAULT_TOKEN="your-vault-token"
```

#### ایجاد Secret

```bash
# از طریق Vault CLI
vault kv put secret/arman/production/database \
  username=dbuser \
  password=SecureP@ss123 \
  host=db.example.com

# خواندن Secret
vault kv get secret/arman/production/database
```

#### استفاده در کد

```typescript
// packages/secrets-manager/src/vault-secrets.ts
import vault from 'node-vault';

export class VaultSecretsManager {
  private client: any;

  constructor(endpoint?: string, token?: string) {
    this.client = vault({
      apiVersion: 'v1',
      endpoint: endpoint || process.env.VAULT_ADDR || 'http://localhost:8200',
      token: token || process.env.VAULT_TOKEN,
    });
  }

  async getSecret(path: string): Promise<any> {
    try {
      const result = await this.client.read(path);
      return result.data.data;
    } catch (error) {
      console.error(`Error retrieving secret ${path}:`, error);
      throw error;
    }
  }

  async getSecretValue(path: string, key: string): Promise<string> {
    const secret = await this.getSecret(path);
    return secret[key];
  }

  async setSecret(path: string, data: Record<string, any>): Promise<void> {
    try {
      await this.client.write(path, { data });
    } catch (error) {
      console.error(`Error setting secret ${path}:`, error);
      throw error;
    }
  }
}

// استفاده
const secretsManager = new VaultSecretsManager();
const dbConfig = await secretsManager.getSecret('secret/arman/production/database');
const jwtSecret = await secretsManager.getSecretValue('secret/arman/production/jwt', 'secret');
```

## ادغام با NestJS

### ماژول Secret Manager

```typescript
// packages/secrets-manager/src/secrets.module.ts
import { Module, Global, DynamicModule } from '@nestjs/common';
import { SecretsService } from './secrets.service';

export interface SecretsModuleOptions {
  provider: 'aws' | 'gcp' | 'vault';
  region?: string;
  projectId?: string;
  endpoint?: string;
}

@Global()
@Module({})
export class SecretsModule {
  static forRoot(options: SecretsModuleOptions): DynamicModule {
    return {
      module: SecretsModule,
      providers: [
        {
          provide: 'SECRETS_OPTIONS',
          useValue: options,
        },
        SecretsService,
      ],
      exports: [SecretsService],
    };
  }
}
```

### سرویس Secret Manager

```typescript
// packages/secrets-manager/src/secrets.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { AWSSecretsManager } from './aws-secrets';
import { GCPSecretsManager } from './gcp-secrets';
import { VaultSecretsManager } from './vault-secrets';
import { SecretsModuleOptions } from './secrets.module';

@Injectable()
export class SecretsService {
  private manager: AWSSecretsManager | GCPSecretsManager | VaultSecretsManager;

  constructor(@Inject('SECRETS_OPTIONS') private options: SecretsModuleOptions) {
    this.initializeManager();
  }

  private initializeManager() {
    switch (this.options.provider) {
      case 'aws':
        this.manager = new AWSSecretsManager(this.options.region);
        break;
      case 'gcp':
        this.manager = new GCPSecretsManager(this.options.projectId);
        break;
      case 'vault':
        this.manager = new VaultSecretsManager(this.options.endpoint);
        break;
      default:
        throw new Error(`Unsupported secrets provider: ${this.options.provider}`);
    }
  }

  async getSecret(name: string): Promise<any> {
    return this.manager.getSecret(name);
  }

  async getSecretValue(name: string, key?: string): Promise<string> {
    if ('getSecretValue' in this.manager) {
      return this.manager.getSecretValue(name, key);
    }
    const secret = await this.getSecret(name);
    return key ? secret[key] : secret;
  }
}
```

### استفاده در AppModule

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecretsModule } from '@arman/secrets-manager';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SecretsModule.forRoot({
      provider: process.env.SECRETS_PROVIDER as 'aws' | 'gcp' | 'vault',
      region: process.env.AWS_REGION,
      projectId: process.env.GCP_PROJECT_ID,
      endpoint: process.env.VAULT_ADDR,
    }),
  ],
})
export class AppModule {}
```

## بهترین روش‌ها (Best Practices)

### ۱. نام‌گذاری رازها

استفاده از ساختار سلسله‌مراتبی:

```
arman/
  ├── production/
  │   ├── database
  │   ├── jwt-secret
  │   ├── redis
  │   └── stripe-api-key
  ├── staging/
  │   ├── database
  │   └── jwt-secret
  └── development/
      ├── database
      └── jwt-secret
```

### ۲. Rotation رازها

```typescript
// تنظیم Rotation خودکار
const rotation = {
  automaticallyAfterDays: 30,
  lambdaFunctionArn: 'arn:aws:lambda:...',
};
```

### ۳. Caching

```typescript
// کش کردن رازها برای کاهش تعداد درخواست‌ها
class CachedSecretsService extends SecretsService {
  private cache = new Map<string, { value: any; timestamp: number }>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  async getSecret(name: string): Promise<any> {
    const cached = this.cache.get(name);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.value;
    }

    const value = await super.getSecret(name);
    this.cache.set(name, { value, timestamp: Date.now() });
    return value;
  }
}
```

### ۴. Fallback به Environment Variables

```typescript
async getDatabaseConfig() {
  try {
    return await this.secretsService.getSecret('arman/production/database');
  } catch (error) {
    console.warn('Failed to load from secrets manager, falling back to env vars');
    return {
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    };
  }
}
```

## Migration از Environment Variables

### مرحله ۱: شناسایی رازها

```bash
# لیست کردن تمام متغیرهای محیطی حساس
grep -r "JWT_SECRET\|DATABASE_PASSWORD\|API_KEY" .env*
```

### مرحله ۲: ایجاد رازها در Secret Manager

```bash
# ایجاد script برای migration
node scripts/migrate-secrets.js
```

```javascript
// scripts/migrate-secrets.js
const { SecretsManagerClient, CreateSecretCommand } = require('@aws-sdk/client-secrets-manager');
const fs = require('fs');
const path = require('path');

async function migrateSecrets() {
  const envFile = fs.readFileSync('.env', 'utf-8');
  const secrets = parseEnvFile(envFile);

  const client = new SecretsManagerClient({ region: 'us-east-1' });

  for (const [key, value] of Object.entries(secrets)) {
    const secretName = `arman/production/${key.toLowerCase().replace(/_/g, '-')}`;

    try {
      await client.send(new CreateSecretCommand({
        Name: secretName,
        SecretString: value,
      }));
      console.log(`✓ Created secret: ${secretName}`);
    } catch (error) {
      console.error(`✗ Failed to create ${secretName}:`, error.message);
    }
  }
}

function parseEnvFile(content) {
  const secrets = {};
  const sensitiveKeys = ['SECRET', 'PASSWORD', 'KEY', 'TOKEN'];

  content.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && sensitiveKeys.some(k => key.includes(k))) {
      secrets[key] = value.trim().replace(/['"]/g, '');
    }
  });

  return secrets;
}

migrateSecrets();
```

### مرحله ۳: به‌روزرسانی کد

```typescript
// قبل
const jwtSecret = process.env.JWT_SECRET;

// بعد
const jwtSecret = await secretsService.getSecret('arman/production/jwt-secret');
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy
  run: |
    export SECRETS_PROVIDER=aws
    export AWS_REGION=us-east-1
    pnpm run deploy
```

## Monitoring و Alerting

### CloudWatch Alarms (AWS)

```bash
# ایجاد Alarm برای دسترسی‌های غیرمجاز
aws cloudwatch put-metric-alarm \
  --alarm-name secrets-unauthorized-access \
  --alarm-description "Alert on unauthorized secrets access" \
  --metric-name UnauthorizedAccess \
  --namespace AWS/SecretsManager \
  --statistic Sum \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold
```

## منابع مفید

- [AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)
- [HashiCorp Vault](https://www.vaultproject.io/docs)
- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)

## پشتیبانی

اگر سوالی در مورد Secret Manager دارید، با تیم DevOps تماس بگیرید.
