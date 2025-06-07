import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggerService } from '../logger/logger.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new LoggerService(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('whoami')
  async whoami(@Request() req: { user: User }) {
    return this.logger.logOperation(
      'whoami',
      async () => {
        const user = await this.usersService.findOne(req.user.id);
        return user;
      },
      {
        userId: req.user.id,
        email: req.user.email,
      }
    );
  }

  @Get()
  async findAll(): Promise<Partial<User>[]> {
    return this.logger.logOperation(
      'findAll',
      async () => {
        const users = await this.usersService.findAll();
        return users;
      },
      { operation: 'list_users' }
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Partial<User>> {
    return this.logger.logOperation(
      'findOne',
      async () => {
        const user = await this.usersService.findOne(id);
        return user;
      },
      { userId: id }
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return this.logger.logOperation(
      'create',
      async () => {
        const user = await this.usersService.create(createUserDto);
        return user;
      },
      {
        email: createUserDto.email,
        name: createUserDto.name,
      }
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Partial<User>> {
    return this.logger.logOperation(
      'update',
      async () => {
        const user = await this.usersService.update(id, updateUserDto);
        return user;
      },
      {
        userId: id,
        updatedFields: Object.keys(updateUserDto),
      }
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.logger.logOperation(
      'delete',
      async () => {
        await this.usersService.delete(id);
      },
      { userId: id }
    );
  }
}
