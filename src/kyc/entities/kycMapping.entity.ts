import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Country } from '../../country/country.entity';

@Entity()
export class KycMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Country, (country) => country.id)
  @JoinColumn()
  country: Country;

  @Column({ nullable: true })
  field1: string;

  @Column({ nullable: true })
  field2: string;

  @Column({ nullable: true })
  field3: string;

  @Column({ nullable: true })
  field4: string;

  @Column({ nullable: true })
  field5: string;

  @Column({ nullable: true })
  field6: string;

  @Column({ nullable: true })
  field7: string;

  @Column({ nullable: true })
  field8: string;

  @Column({ nullable: true })
  field9: string;

  @Column({ nullable: true })
  field10: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
