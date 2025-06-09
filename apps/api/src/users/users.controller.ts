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
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  USER_ERROR_RESPONSES,
  VALIDATION_ERROR_RESPONSES,
  createApiResponse,
} from '../common/swagger/schemas';
import { LoggerService } from '../logger/logger.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService
  ) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the current user profile',
  })
  @createApiResponse(USER_ERROR_RESPONSES.UNAUTHORIZED)
  @Get('whoami')
  async whoami(
    @Request() req: { user: User },
    @Headers('accept-language') acceptLanguage?: string
  ) {
    return this.logger.logOperation(
      'whoami',
      async () => {
        const user = await this.usersService.findOne(req.user.id, acceptLanguage);
        return user;
      },
      {
        userId: req.user.id,
        email: req.user.email,
      }
    );
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of all users',
  })
  @createApiResponse(USER_ERROR_RESPONSES.UNAUTHORIZED)
  @createApiResponse(USER_ERROR_RESPONSES.FORBIDDEN)
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

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the user with the specified ID',
  })
  @createApiResponse(USER_ERROR_RESPONSES.NOT_FOUND)
  @createApiResponse(USER_ERROR_RESPONSES.UNAUTHORIZED)
  @createApiResponse(USER_ERROR_RESPONSES.FORBIDDEN)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') acceptLanguage?: string
  ): Promise<Partial<User>> {
    return this.logger.logOperation(
      'findOne',
      async () => {
        const user = await this.usersService.findOne(id, acceptLanguage);
        return user;
      },
      { userId: id }
    );
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created',
  })
  @createApiResponse(VALIDATION_ERROR_RESPONSES.INVALID_EMAIL)
  @createApiResponse(VALIDATION_ERROR_RESPONSES.PASSWORD_TOO_SHORT)
  @createApiResponse(USER_ERROR_RESPONSES.UNAUTHORIZED)
  @createApiResponse(USER_ERROR_RESPONSES.FORBIDDEN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Headers('accept-language') acceptLanguage?: string
  ): Promise<Partial<User>> {
    return this.logger.logOperation(
      'create',
      async () => {
        const user = await this.usersService.create(createUserDto, acceptLanguage);
        return user;
      },
      {
        email: createUserDto.email,
        name: createUserDto.name,
      }
    );
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully updated',
  })
  @createApiResponse(USER_ERROR_RESPONSES.NOT_FOUND)
  @createApiResponse(VALIDATION_ERROR_RESPONSES.INVALID_EMAIL)
  @createApiResponse(USER_ERROR_RESPONSES.UNAUTHORIZED)
  @createApiResponse(USER_ERROR_RESPONSES.FORBIDDEN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('accept-language') acceptLanguage?: string
  ): Promise<Partial<User>> {
    return this.logger.logOperation(
      'update',
      async () => {
        const user = await this.usersService.update(id, updateUserDto, acceptLanguage);
        return user;
      },
      {
        userId: id,
        updatedFields: Object.keys(updateUserDto),
      }
    );
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User has been successfully deleted',
  })
  @createApiResponse(USER_ERROR_RESPONSES.NOT_FOUND)
  @createApiResponse(USER_ERROR_RESPONSES.UNAUTHORIZED)
  @createApiResponse(USER_ERROR_RESPONSES.FORBIDDEN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Headers('accept-language') acceptLanguage?: string
  ): Promise<void> {
    return this.logger.logOperation(
      'delete',
      async () => {
        await this.usersService.delete(id, acceptLanguage);
      },
      { userId: id }
    );
  }
}
