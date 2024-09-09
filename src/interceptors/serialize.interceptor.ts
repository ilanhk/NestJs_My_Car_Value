//Interceptors intercept requests or responses so we can manipulate tham 
//similar to middlewares but it will happen after middlewares and guards before or after the request
import { 
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

interface ClassConstructor {
  new (...args: any[]): {}
};
//this interface means any class is accepted


export function Serialize(dto: ClassConstructor){
  return UseInterceptors(new SerializeInterceptor(dto))
};
//creating our own decorators. decorators are manly functions.


export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor){};

  intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
      //Run something before request is handled by the request handler
      // console.log('I am running b4 the handler:', context);

      return handler.handle().pipe(
        map((data: any)=>{
          //Run something b4 response is sent
          console.log('I am running before response is sent out', data);

          return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true //this would only show properties that have @Expose(). Other properties would be ignored.
          }); 
          //we want to turn data into an instance of the dto ex UserDto
        })
      );
  };

};
// SerializeInterceptor implements NestInterceptor - SerializeInterceptor must meet the requirments of the NestInterceptor

