// a guard prevents access to a request

import { 
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";


export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();

      return request.session.userId;
  }
};
//if the userId exist we can access the route(s)
//if userId is false, null, undefine ... it will prevent access to the route(s)