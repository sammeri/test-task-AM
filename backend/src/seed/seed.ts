import { DataSource } from 'typeorm';
import { Item } from '../items/item.entity';

async function runSeed() {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 5432);
  const username = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const database = process.env.DB_NAME || 'testdb';

  const ds = new DataSource({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [Item],
  });

  await ds.initialize();

  const repo = ds.getRepository(Item);
  const existing = await repo.count();
  if (existing >= 50000) {
    console.log(`DB already has ${existing} records — skipping seed.`);
    await ds.destroy();
    return;
  }

  const total = 50000;
  const batchSize = 1000;
  let created = existing;

  console.log(
    `Seeding ${total - existing} items in batches of ${batchSize}...`,
  );

  for (let i = existing + 1; i <= total; i += batchSize) {
    const batch: Partial<Item>[] = [];
    const upper = Math.min(i + batchSize - 1, total);
    for (let j = i; j <= upper; j++) {
      batch.push({
        name: `Item ${j}`,
      });
    }
    await repo.insert(batch);
    created += batch.length;
    if (created % 5000 === 0) console.log(`Inserted ${created} / ${total}`);
  }

  console.log('seed.ts - готово.');
  await ds.destroy();
}

runSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});
