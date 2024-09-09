import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm'; //all are decorators
// AfterInsert, AfterRemove, AfterUpdate are hook decorators
import { Report } from '../reports/report.entity';

@Entity() //need this decorator to create a table of this class in the db
export class User {
  @PrimaryGeneratedColumn() //id is unique it would be generated automatically for every new user
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(()=> Report, (report)=> report.user) // making a relationship between user and reports, one user many reports
  reports: Report[]; 
  // ()=> Report this is because of "circular dependency issue", need to wrap in a function to access the Report entity 
  // if not by itself Report will be undefine

  @AfterInsert() //everytime user is inserted in the db the func logInsert() will be called
  logInsert() {
    console.log('Inserted user with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log(`user with id: ${this.id} was removed from the db`);
  }
}
//its convention to name it User instead of UserEntity
