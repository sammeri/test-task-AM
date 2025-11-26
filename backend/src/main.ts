import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import waitPort from 'wait-port';

async function waitForDb() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await waitPort({
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT) || 5432,
    timeout: 30000,
    interval: 100,
  });
}

async function bootstrap() {
  await waitForDb();
  const app = await NestFactory.create(AppModule);

  const isProd = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: isProd
      ? ['http://localhost:80', 'http://localhost:3000']
      : 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
