import { Column as Col, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from './User.js'

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Col()
  title!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner!: User
}
