import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Course } from './course.entity';

import { User as IUser } from '../interfaces/auth';

@Entity({ name: 'user' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: false, unique: true })
  login: string;

  @Column({ type: String, nullable: false })
  password: string;

  @Column({ type: Boolean, default: true })
  isActive: boolean;

  @ManyToMany(() => Course, (course: Course) => course.users)
  @JoinTable()
  courses: Course[];
}
