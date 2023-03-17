import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organizer } from '../../organizer/entity/organizer.entity';
import { KycMapping } from './kycMapping.entity';

@Entity()
export class KycContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => KycMapping, (kycMapping) => kycMapping.id)
  kycMapping: string;

  @OneToOne(() => Organizer, (organizer) => organizer.id)
  organizer: Organizer;

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
