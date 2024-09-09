import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {} 
  // repo: Repository<User> repo will be type repository that handles users (its a generic type)
  // @InjectRepository(User) - tell the dependency injection system we need the user repository. Its used when their is a generic type

  create(email: string, password: string){
    const user = this.repo.create({email, password});

    return this.repo.save(user);
  };
  // this.repo.save({email, password}); would have worked on its own 
  //but its better to create (this.repo.create({email, password})) this user instance first to see if email and password are valid
  //also need user instance if want to use decorator hooks

findOne(id: number){
  if(!id){
    return null;
  }
  return this.repo.findOneBy({ id });
};
// findOneBy() will return one record or null

find(email: string){
  return this.repo.find({ where: { email } })
};
// find() will return an array of all the records that have that specific email. If no results we will get back an empty array 

async update(id: number, attrs: Partial<User>){
  const user = await this.findOne(id)
  
  if(!user){
    throw new NotFoundException('User not found');
  };

  Object.assign(user, attrs); //make changes to the user with the attrs object, Object.assign will take all properties of attrs and merge with user object overidding any properties that are already in user

  return this.repo.save(user); //save the updated user in the db.
};
// attrs: Partial<User> - Partial is part of typescript. Partial<User> means that its an object that has at least or none any property(s) of the User class

async remove(id: number){
  const user = await this.findOne(id)
  
  if(!user){
    throw new NotFoundException('User not found');
  };

  return this.repo.remove(user);
};
// remove is for entities, delete is for dbs
//better the use remove() than delete() bc hooks will work with remove not delete
  
};

