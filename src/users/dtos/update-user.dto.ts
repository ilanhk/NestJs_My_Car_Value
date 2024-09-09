import { IsEmail, IsString, IsOptional } from "class-validator";

export class UpdateUserDto {

  @IsEmail()
  @IsOptional() //this field is optional
  email: string;

  @IsString()
  @IsOptional()
  password: string
};

