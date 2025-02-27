import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Tag } from '../tag/tag.entity';

import { WorkHoursType } from './types/work-hours.type';

@Entity()
export class Attraction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { default: '' })
  title: string;

  @Column('text', { default: '' })
  description: string;

  @Column('text', { default: '' })
  thumbnail: string;

  @Column('float', { default: '0.00' })
  averageRating: number;

  @Column('int', { default: 0 })
  reviewsCount: number;

  @Column('int', { default: 0 })
  ratingCount: number;

  @Column('jsonb', { array: false, default: [] })
  workHours: WorkHoursType[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @Column('text', { default: '', nullable: true })
  phone: string;

  @Column('text', { default: '' })
  url: string;

  @Column('text', { default: '' })
  address: string;

  @Column('jsonb', { array: false, default: [] })
  carousel: string[];

  @Column('text', { default: '' })
  body: string;
}
