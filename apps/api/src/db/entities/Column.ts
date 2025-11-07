import {
  Column as Col,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Project } from './Project.js'

@Entity({ name: 'columns' })
@Index(['project', 'position'])
export class Column {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Col('varchar')
  title!: string

  @Col({ type: 'integer', default: 1000 })
  position!: number

  //@TODO: change this to a trigger based approach on SQL
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project!: Project
}
