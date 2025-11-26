import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
