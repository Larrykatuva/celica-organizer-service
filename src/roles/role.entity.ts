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
  ORGANIZER_ADMIN = 'ORGANIZER_ADMIN',
  ORGANIZER_USER = 'ORGANIZER_USER',
}

export const STAFF_ROLES: ROLE[] = [
  ROLE.SUPER_ADMIN,
  ROLE.SUPPORT,
  ROLE.SUPPORT,
  ROLE.BUSINESS,
];

export const ORGANIZER_ROLES: ROLE[] = [ROLE.ORGANIZER_ADMIN];

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.ORGANIZER_USER,
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
