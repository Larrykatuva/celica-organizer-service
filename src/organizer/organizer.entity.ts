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
import { Country } from '../country/country.entity';

@Entity()
export class Organizer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sub: string;

  @Column()
  name: string;

  @Column()
  logo: string;

  @OneToOne(() => Country, (country) => country.id)
  @JoinColumn()
  country: Country;

  @OneToOne(() => User, (user) => user.sub)
  @JoinColumn()
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
