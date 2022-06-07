import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

// "describe" add further description to organize the test in terminal
describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({
          id: 1,
          email,
          password,
        } as unknown as User),
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
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'a', password: 'b' },
      ] as unknown as User[]);

    expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'email in use',
    );
  });

  it('throws if sign in is called with an unused email', () => {
    expect(service.signIn('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'user not found',
    );
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'hello' },
      ] as unknown as User[]);

    expect(service.signIn('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'bad password',
    );
  });

  it('returns a user if correct password is provided', async () => {
    const users: User[] = [];

    fakeUsersService.find = (email: string) => {
      const filteredUsers = users.filter((user) => user.email === email);
      return Promise.resolve(filteredUsers);
    };

    fakeUsersService.create = (email: string, password: string) => {
      const user = {
        id: String(Math.floor(Math.random() * 9999)),
        email,
        password,
      } as unknown as User;

      users.push(user);
      return Promise.resolve(user);
    };

    await service.signup('asdf@asdf.com', 'hello');

    const user = await service.signIn('asdf@asdf.com', 'hello');
    expect(user).toBeDefined();
  });
});
