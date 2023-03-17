import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { Organizer } from './organizer.entity';

@Entity()
export class Affiliate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.sub)
  user: User;

  @OneToOne(() => Organizer, (organizer) => organizer.id)
  organizer: Organizer;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
