import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '../../auth/AuthGuard';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersRepository } from '../users.repository';

describe('UsersController', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'QEgkV/MVCZm+5/pyLyOsN0h6rb9HioMs2EedsRLrMwA=',
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        Reflector,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest
              .fn()
              .mockResolvedValue([
                { id: '1', name: 'John Doe', role: 'admin' },
              ]),
          },
        },
        {
          provide: 'AUTH_GUARD',
          useClass: AuthGuard,
        },
        {
          provide: 'ROLES_GUARD',
          useClass: RolesGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  it('/GET users (admin role)', async () => {
    const token = jwtService.sign({ role: 'admin' });

    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([{ id: '1', name: 'John Doe', role: 'admin' }]);
  });

  afterAll(async () => {
    await app.close();
  });
});
