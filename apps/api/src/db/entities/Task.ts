import {
  Column as Col,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Column as BoardColumn } from './Column.js'

@Entity({ name: 'tasks' })
@Index(['column', 'position'])
export class Task {
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

  @ManyToOne(() => BoardColumn, { onDelete: 'CASCADE' })
  column!: BoardColumn
}
