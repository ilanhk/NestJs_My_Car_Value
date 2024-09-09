import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

declare global {
  namespace Express { //go to the Express library
    interface Request { //find interface Request
      currentUser?: User //add this property to the interface Request
    }
  }
}; 
//TS doesnt recognize currentUser as a Request property 
// so need to modify the Request interface to add currentUser


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
  constructor(private usersService: UsersService){}
  
  async use(request: Request, response: Response, next: NextFunction){
    const { userId } = request.session || {};

    if(userId){
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }

    next();
  };
};

