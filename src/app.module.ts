import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'; //allows us to use sqlite, postgres or mongodb, mongoose is only for mongodb.
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import cookieSession = require('cookie-session'); //somehow we need to import like this for cookie-session because doesnt meet the requirements of tsconfig


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` //if NODE_ENV is in development it will use the env.develolpment if its in test etc..
    }),
    TypeOrmModule.forRoot(require("../ormconfig.js")),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService], //tells the dependency injection system that we want to find the ConfigService which would have all the config info inside from the chosen .env file. We want an instance to the ConfigService during the setup of the TypeOrmModule
    //   useFactory: (config: ConfigService)=>{
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'), //name of db
    //       entities: [User, Report], //things we want to store inside the app like User Entity etc
    //       synchronize: true, 
    //       //this would migrate to the db any changes auotmatically if we would make changes on any entities (only when the app next starts up or runs).
    //       // make synchronize: true  only in a development enviroment. In production make synchronize: false so dont have any unneccessary changes or mistakes in the db. In production we would migrate to the db normally
    //     };
    //   },
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite', //name of db
    //   entities: [User, Report], //things we want to store inside the app like User Entity etc
    //   synchronize: true, 
    //   //this would migrate to the db any changes auotmatically if we would make changes on any entities (only when the app next starts up or runs).
    //   // make synchronize: true  only in a development enviroment. In production make synchronize: false so dont have any unneccessary changes or mistakes in the db. In production we would migrate to the db normally
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, //any other properties that are not in the dto the extra property(s) will be ignored. its done for security reasons.
      }) // this was in main.ts but moved here so we can use the pipe for testing. This is how to setup a global pipe also.
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService){};

  configure(consumer: MiddlewareConsumer){
    consumer.apply( 
      //pass in the middleware we want to run here
      cookieSession({
        keys: [this.configService.get('COOKIE_KEY')],
      })
    ).forRoutes('*') //for all routes (global middleware)
  } //this configure() will be called automatically whenever the app listens for incomming traffic
}
