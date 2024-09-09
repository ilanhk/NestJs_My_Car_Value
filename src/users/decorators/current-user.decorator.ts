import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext)=>{
    const request = context.switchToHttp().getRequest(); //this will get the req that is comming.
    return request.currentUser; //currentUser is from the CurrentUserInterceptor
  },
);
// whaever we return in this function will show up as the argument to our route handler
//data will contain any data/argument that we provide to our decorator that we make use of ex CurrentUser('sdfgdf)
//for this case data: never we are never goind to use this (no arguments to add to the decorator)
//context is a wrapper around the incomming request
//ExecutionContext is called that because its for all types of requests not just HTTP but also for websockets GRPC, GraphQL or any other communication protocol
// ExecutionContext  - but mainly its for the incomming request
//Param decorators exist outside dependenct injection system so cant get an instance of UsersService directly thats why we need an interceptor