import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Course } from './course.entity';

import { File as IFile } from '../interfaces/file';

@Entity({ name: 'file' })
export class File implements IFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  filePath: string;

  @Column({ type: 'int', nullable: false })
  fileSize: number;

  @Column({ type: 'varchar', length: 15, nullable: false })
  extension: string;

  @ManyToMany(() => Course, (course: Course) => course.files, { cascade: true })
  @JoinTable()
  courses: Course[];
}
