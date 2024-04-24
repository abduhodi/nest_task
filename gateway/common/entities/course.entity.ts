import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { File } from './file.entity';
import { User } from './user.entity';

import { Course as ICourse } from '../interfaces/course';

@Entity({ name: 'course' })
export class Course implements ICourse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @ManyToMany(() => File, (file: File) => file.courses)
  files: File[];

  @ManyToMany(() => User, (user: User) => user.courses, { cascade: true })
  users: User[];
}
