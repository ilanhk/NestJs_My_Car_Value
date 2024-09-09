import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  Query, 
  NotFoundException,
  Session, //for cookie-session
  UseGuards 
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto'; 
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';


@Controller('auth')
@Serialize(UserDto) //intercept the response so the response wont show the password. This will apply to all routes bellow
export class UsersController {
  constructor(private userService: UsersService, private authService: AuthService){};

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User){
    return user;
  };

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  };
  

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session:any){
    const user = await this.authService.authSignUp(body.email, body.password);
    session.userId = user.id;
    return user;
  };


  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session:any){
    const user = await this.authService.authSignIn(body.email, body.password);
    session.userId = user.id;
    return user;
  };



  @Get('/:id')
  async findUser(@Param('id') id: string){
    const user = await this.userService.findOne(parseInt(id)); //need to make id a number first
    if(!user){
      throw new NotFoundException('user not found')
    };

    return user;
  };


  @Get()
  findAllUsers(@Query('email') email: string){
    return this.userService.find(email);
  };


  @Delete('/:id')
  removeUser(@Param('id') id: string){
    return this.userService.remove(parseInt(id));
  };


  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
    return this.userService.update(parseInt(id), body)
  };


}
