import { Column as Col, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Column as BoardColumn } from './Column.js'

@Entity({ name: 'tasks' })
@Index(['column', 'position'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Col()
  title!: string

  @Col({ type: 'integer', default: 1000 })
  position!: number

  @ManyToOne(() => BoardColumn, { onDelete: 'CASCADE' })
  column!: BoardColumn
}
