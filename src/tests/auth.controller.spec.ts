import request from 'supertest';
import app from '../index';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import { UserEntity } from '../domain/entities/user.entity';

jest.mock('../infrastructure/database/repositories/user.repository');

describe('Auth Controller', () => {
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;

    // ✅ Mock `createUser` method to return a `UserEntity`
    jest
      .spyOn(mockUserRepository, 'createUser')
      .mockResolvedValue(
        new UserEntity(
          '123',
          'testuser',
          'test@example.com',
          'hashedpassword',
          []
        )
      );

    // ✅ Mock `findByEmail` for duplicate user check
    jest.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null);
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });

  it('should return an error for duplicate user', async () => {
    // ✅ Simulate user already exists
    jest
      .spyOn(mockUserRepository, 'findByEmail')
      .mockResolvedValue(
        new UserEntity(
          '123',
          'testuser',
          'test@example.com',
          'hashedpassword',
          []
        )
      );

    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User already exists');
  });
});
