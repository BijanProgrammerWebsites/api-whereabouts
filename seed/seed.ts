import 'dotenv/config';

import { DataSource } from 'typeorm';

import db from './data/db.json';

import { Attraction } from '../src/attraction/attraction.entity';
import { Tag } from '../src/tag/tag.entity';

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_DATABASE!,
  entities: [Attraction, Tag],
});

datasource.initialize().then(async () => {
  await datasource.synchronize(true);

  await seedTags();
  await seedAttractions();
});

async function seedTags(): Promise<void> {
  const tags = db.attractions.flatMap((attraction) => attraction.tags);

  const idSet = new Set<number>();
  const uniqueTags: Tag[] = tags.filter((tag) => {
    if (idSet.has(tag.id)) {
      return false;
    }

    idSet.add(tag.id);
    return true;
  });

  const tagsRepository = datasource.getRepository(Tag);
  await tagsRepository.save(uniqueTags);
}

async function seedAttractions(): Promise<void> {
  const attractionRepository = datasource.getRepository(Attraction);
  await attractionRepository.save(db.attractions as Attraction[]);
}
