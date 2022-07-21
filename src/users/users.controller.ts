import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from './models/user.entity';
import { JwtAuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './models/role.enum';
import { RolesGuard } from './guards/role.guard';
import { AppleOAuthGuard } from './guards/appleOAuth.guard';
import { AppleOAuthDto } from './dtos/appleOAuth.dto';
import { GoogleOAuthGuard } from './guards/googleOAuth.guard';
import { GoogleOAuthDto } from './dtos/googleOAuth.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private UsersService: UsersService,
    private AuthService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  async whoami(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.AuthService.signup(body.email, body.password);
    return user;
  }

  @UseGuards(AppleOAuthGuard)
  @Post('/signup/apple')
  async signupApple(@Body() appleDto: AppleOAuthDto) {
    return await this.AuthService.appleSignup(appleDto);
  }

  @UseGuards(AppleOAuthGuard)
  @Post('/login/apple')
  async loginApple(@Body() appleDto: AppleOAuthDto) {
    return await this.AuthService.appleLogin(appleDto);
  }

  @UseGuards(GoogleOAuthGuard)
  @Post('/login/google')
  async loginGoogle(@Body() googleDto: GoogleOAuthDto) {
    return await this.AuthService.googleLogin(googleDto);
  }

  @Post('/login')
  async login(@Body() body: CreateUserDto) {
    return await this.AuthService.login(body.email, body.password);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.UsersService.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.UsersService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.UsersService.update(id, body);
  }
}
