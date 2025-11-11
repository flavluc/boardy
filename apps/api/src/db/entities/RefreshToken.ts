import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from './User.js'

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string // JTI

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User

  @Column({ type: 'boolean', default: false })
  revoked!: boolean

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date
}
