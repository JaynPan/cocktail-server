import { Expose } from 'class-transformer';

import { Role } from '../models/role.enum';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  accessToken: string;

  @Expose()
  role: Role;
}
