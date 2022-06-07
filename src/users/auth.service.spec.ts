import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

// "describe" add further description to organize the test in terminal
describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];

  beforeEach(async () => {
    // create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: String(Math.floor(Math.random() * 9999)),
          email,
          password,
        } as unknown as User;

        users.push(user);
        return Promise.resolve(user);
      },
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

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in used', async () => {
    expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'email in use',
    );
  });

  it('throws if sign in is called with an unused email', () => {
    expect(service.signIn('bababa@example.com', 'ha')).rejects.toThrow(
      'user not found',
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('hohoho@asdf.com', 'password');

    expect(service.signIn('hohoho@asdf.com', 'incorrect')).rejects.toThrow(
      'bad password',
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('hello@example.com', 'hello');

    const user = await service.signIn('hello@example.com', 'hello');
    expect(user).toBeDefined();
  });
});
