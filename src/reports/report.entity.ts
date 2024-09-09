import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false }) //make this by default false
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @Column()
  mileage: number;


  @ManyToOne(()=> User, (user)=> user.reports) //making a relationship between reports and users. Many reports one user.
  user: User;
};
