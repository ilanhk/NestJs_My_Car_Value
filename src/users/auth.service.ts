import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; 
import { promisify } from "util";
//for hashing, crpyto is part of the node standard library, 
// randomBytes - gives random letters and numbers
// scrypt - is the actual hashing function, its asyncronos but doesnt return a promise 
// would need to use a callback if i dont "promisify" it 

const scrypt = promisify(_scrypt); //make it a promise


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService){};

  async authSignUp(email: string, password: string){
    //See if email is in use
    const users = await this.usersService.find(email);

    if (users.length){
      throw new BadRequestException('email already in use')
    }

    //Hash the users password

    //Generate a salt
    const salt = randomBytes(8).toString('hex'); 
    //randomBytes creates 8bytes of 1s and 0s to string hex will convert it to a hexidecimal string (random numbers and letters)
    //should create a 16 character long string

    //hash the salt and password together
    const hash = (await scrypt(password, salt, 32) as Buffer);
     // hash the password with the salt to 32 characters
     // Buffer is what is returned from scrypt TS doesnt know what scrypt returns

    //join the hash result and the salt together
    const result = salt + '.' + hash.toString('hex');

    //Create a new user and save it
    const user = await this.usersService.create(email, result);

    //return the user
    return user;
  };

  async authSignIn(email: string, password: string){
    const [user] = await this.usersService.find(email); //[user] because find would return an array. We are expecting only one user

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if(storedHash !== hash.toString('hex')){
      throw new BadRequestException('wrong password');
    };

    return user;


  };
};