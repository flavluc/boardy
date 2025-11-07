import { Entity, ManyToOne, PrimaryColumn } from 'typeorm'

import { Project } from './Project.js'
import { User } from './User.js'

@Entity({ name: 'project_members' })
export class ProjectMember {
  @PrimaryColumn('uuid')
  userId!: string

  @PrimaryColumn('uuid')
  projectId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project!: Project
}
