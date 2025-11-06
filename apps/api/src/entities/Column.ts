import { Column as Col, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

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

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project!: Project
}
