import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

// add further description to organize the test in terminal
describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
    // create a fake copy of the users service
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as unknown as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        // list of things we want to register in our testing DI container
        // * the auth service needs usersService
        AuthService,
        {
          // * if anyone asks for UsersService,
          provide: UsersService,
          // * give them this object
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
});
