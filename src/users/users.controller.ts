import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.UsersService.create(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.UsersService.findOne(id);
  }

  @Get()
  findAllUser(@Query('email') email: string) {
    return this.UsersService.find(email);
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
