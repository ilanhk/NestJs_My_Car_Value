//this file should be in the root project directory
//this file is in JS because TypeORM and Nestjs have problems with running TS in a production enviroment
//typeorm docs https://typeorm.io/using-cli

var dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'], //when in test enviroment need to look for the ts files
      migrationsRun: true, //all migrations would run for each individual test
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'], //in production we are running js
      ssl: {
        regectUnauthorized: false
      } //this is for heroku
    });
    break;
  default:
    throw new Error('unknown enviroment');
};

module.exports = dbConfig;


