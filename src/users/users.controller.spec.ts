import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: string) => {
        return Promise.resolve({
          id,
          email: 'hello@gmail.com',
          password: '123',
        } as unknown as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: '1',
            email,
            password: '123',
          },
        ] as unknown as User[]);
      },
    };
    fakeAuthService = {
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: '1', email, password } as unknown as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUser('aloha@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('aloha@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('32');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with the given id not found', async () => {
    fakeUsersService.findOne = () => null;
    expect(controller.findUser('32')).rejects.toThrow('user not found');
  });

  it('signIn updates session object and returns user', async () => {
    const session = { userId: undefined };
    const user = await controller.signIn(
      { email: 'hello@gmail.com', password: 'jajaja' },
      session,
    );

    expect(user.id).toEqual('1');
    expect(session.userId).toEqual('1');
  });
});
