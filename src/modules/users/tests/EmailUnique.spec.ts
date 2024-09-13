import { Test, TestingModule } from '@nestjs/testing';
import { IsEmailUnique } from 'src/validators/email.validator';
import { UsersService } from '../users.service';

describe('IsEmailUnique Validator', () => {
  let validator: IsEmailUnique;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsEmailUnique,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    validator = module.get<IsEmailUnique>(IsEmailUnique);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('should return true if email is unique', async () => {
    const email = 'test@example.com';
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(undefined);

    const result = await validator.validate(email, null);
    expect(result).toBe(true);
  });

  it('should return false if email already exists', async () => {
    const email = 'test@example.com';
    const existingUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedpassword',
      address: '123 Street',
      phone: 1234567890,
      country: 'Country',
      city: 'City',
      role: 'default',
    };
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(existingUser);

    const result = await validator.validate(email, null);
    expect(result).toBe(false);
  });

  it('should return default error message', () => {
    const defaultMessage = validator.defaultMessage(null);
    expect(defaultMessage).toBe('Email $value already exists.');
  });
});
