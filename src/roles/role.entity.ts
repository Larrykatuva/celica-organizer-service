import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../shared/entities/user.entity';

export enum ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPPORT = 'SUPPORT',
  BUSINESS = 'BUSINESS',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  CLIENT_USER = 'CLIENT_USER',
}

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.CLIENT_USER,
  })
  role: ROLE;

  @OneToOne(() => User, (user) => user.sub)
  @JoinColumn()
  user: User;

  @OneToOne(() => User, (user) => user.sub)
  @JoinColumn()
  assignedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
