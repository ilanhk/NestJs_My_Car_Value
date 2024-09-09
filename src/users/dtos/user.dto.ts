//Default way of showing a user to the outside world

import { Expose } from "class-transformer";


export class UserDto {
  
  @Expose() // means do show this property the opposite is @Exclude
  id: number;

  @Expose()
  email: string;


};