import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
//e2e - end to end testing (testing an instance of the whole app with a mock server)

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const emailTest = 'testing@test23.com'

    return request(app.getHttpServer()) // attempting to make a req to our http server
      .post('/auth/signup')
      .send({emailTest, password: 'cvxbxc'})
      .expect(201)
      .then((response)=>{
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toEqual(emailTest);
      })  
  });

  it('signup as a new user and get the current logged in user', async ()=>{
     const emailTest = 'testing22@test23.com'

     const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({emailTest, password:'cvDFSGS'})
      .expect(201)

    const cookie = response.get('Set-Cookie');

     const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
    
    expect(body.email).toEqual(emailTest);

  });
});
