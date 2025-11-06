# OpenAPI Documentation

این پوشه شامل مستندسازی OpenAPI (Swagger) برای APIهای REST پروژه آرمان ورزش است.

## فایل‌های موجود

- **services-api.yaml**: مستندات OpenAPI 3.0 کامل برای تمام سرویس‌های REST

## مشاهده مستندات

### استفاده از Swagger UI (توصیه می‌شود)

می‌توانید از Swagger UI برای مشاهده تعاملی مستندات استفاده کنید:

```bash
# نصب swagger-ui-watcher برای مشاهده local
npx @apidevtools/swagger-cli serve docs/openapi/services-api.yaml
```

سپس به آدرس http://localhost:8080 بروید.

### استفاده از Swagger Editor آنلاین

1. به https://editor.swagger.io بروید
2. محتویات فایل `services-api.yaml` را کپی کنید
3. در Editor پیست کنید

### استفاده از VS Code

اکستنشن های پیشنهادی:
- **Swagger Viewer**: برای مشاهده فایل‌های OpenAPI در VS Code
- **OpenAPI (Swagger) Editor**: برای ویرایش و اعتبارسنجی

## اعتبارسنجی

برای اطمینان از صحت فایل OpenAPI:

```bash
# نصب swagger-cli
npm install -g @apidevtools/swagger-cli

# اعتبارسنجی
swagger-cli validate docs/openapi/services-api.yaml
```

## تولید کد کلاینت

می‌توانید از OpenAPI Generator برای تولید کد کلاینت استفاده کنید:

```bash
# نصب OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# تولید کلاینت TypeScript
openapi-generator-cli generate \
  -i docs/openapi/services-api.yaml \
  -g typescript-axios \
  -o packages/api-client

# تولید کلاینت Python
openapi-generator-cli generate \
  -i docs/openapi/services-api.yaml \
  -g python \
  -o clients/python

# تولید کلاینت Java
openapi-generator-cli generate \
  -i docs/openapi/services-api.yaml \
  -g java \
  -o clients/java
```

## به‌روزرسانی مستندات

هنگامی که endpoint های جدید اضافه می‌کنید یا تغییراتی در API ایجاد می‌کنید:

1. فایل `services-api.yaml` را ویرایش کنید
2. اعتبارسنجی کنید: `swagger-cli validate docs/openapi/services-api.yaml`
3. تغییرات را commit کنید

## بهترین روش‌ها

### برای توسعه‌دهندگان Backend

1. **همیشه OpenAPI را به‌روز نگه دارید**: هنگامی که endpoint جدید اضافه می‌کنید، آن را در OpenAPI ثبت کنید
2. **از decoratorهای NestJS استفاده کنید**: از `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` استفاده کنید
3. **مستندات را تست کنید**: از Swagger UI برای تست endpointها استفاده کنید

### برای توسعه‌دهندگان Frontend

1. **از کد تولید شده استفاده کنید**: به جای نوشتن دستی، از OpenAPI Generator استفاده کنید
2. **Type Safety**: کلاینت تولید شده type-safe است
3. **مستندات همیشه به‌روز**: با استفاده از مستندات OpenAPI، همیشه از ساختار API مطمئن باشید

## ادغام با NestJS

برای تولید خودکار OpenAPI از NestJS:

```typescript
// در main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('ArmanVarzesh API')
  .setDescription('ArmanVarzesh Microservices API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

// دسترسی به مستندات: http://localhost:3000/api-docs
```

## منابع مفید

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction)

## پشتیبانی

اگر سوالی در مورد مستندات API دارید، با تیم توسعه تماس بگیرید.
