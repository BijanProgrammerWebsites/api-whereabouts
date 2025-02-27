import 'dotenv/config';

import { DataSource } from 'typeorm';

import db from '../../data/db.json';

import { Attraction } from '../attraction/attraction.entity';
import { Tag } from '../tag/tag.entity';

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
  const tags = [
    ...new Set(db.attractions.flatMap((attraction) => attraction.tags)),
  ];

  const tagsRepository = datasource.getRepository(Tag);
  await tagsRepository.save(tags as Tag[]);
}

async function seedAttractions(): Promise<void> {
  const attractionRepository = datasource.getRepository(Attraction);
  await attractionRepository.save(db.attractions as Attraction[]);
}
