import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    //create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 6547),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    // Partial<UsersService> means partial version of the UsersService

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        }, //this is for dependecies
      ],
    }).compile();

    service = module.get(AuthService);
  });
  //b4 each test

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hash password', async () => {
    const user = await service.authSignUp('sdsadf@example.com', 'fsdgfsadgf');

    expect(user.password).not.toEqual('fsdgfsadgf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.authSignUp('asdf@asdf.com', 'asdf');
    await expect(service.authSignUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
 
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.authSignIn('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
 
  it('throws if an invalid password is provided', async () => {
    await service.authSignUp('laskdjf@alskdfj.com', 'password');
    await expect(
      service.authSignIn('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns if correct password is provided', async () => {
    await service.authSignUp('asdflkj@asdlfkj.com', 'myfairlady!');

    const user = await service.authSignIn('asdflkj@asdlfkj.com', 'myfairlady!');

    expect(user).toBeDefined();
  });
});

//describe just names this test block
