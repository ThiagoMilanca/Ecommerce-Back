import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/User.dto';
import { AuthGuard } from '../auth/AuthGuard';
import { RolesGuard } from './roles/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/roles.enum';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully :)',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have authorization for this route :|',
  })
  @ApiResponse({ status: 404, description: 'Users not found :(' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully :)',
  })
  @ApiResponse({
    status: 401,
    description: 'You do not have a token :|',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have authorization for this route :|',
  })
  @ApiResponse({ status: 404, description: 'User not found :(' })
  @UseGuards(AuthGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example: {
        summary: 'Example of registering a new user',
        value: {
          name: 'Lionel Messi',
          email: 'lionel.messi@example.com',
          password: 'we.love.messi!',
          address: '123 Main St',
          phone: 1234567890,
          country: 'Argentina',
          city: 'Rosario',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully :)',
  })
  @ApiResponse({ status: 400, description: 'The format used is incorrect :(' })
  @ApiResponse({ status: 404, description: 'User not created :(' })
  addUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.addUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify a user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the user',
    type: String,
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      example0: {
        summary: 'Example of changing username',
        value: {
          name: 'new name',
        },
      },
      example1: {
        summary: 'Example of changing email',
        value: {
          email: 'new email',
        },
      },
      example2: {
        summary: 'Example of changing password',
        value: {
          password: 'new password',
        },
      },
      example3: {
        summary: 'Example of changing address',
        value: {
          address: 'new address',
        },
      },
      example4: {
        summary: 'Example of changing phone',
        value: {
          phone: 1234567890,
        },
      },
      example5: {
        summary: 'Example of changing country',
        value: {
          country: 'new country',
        },
      },
      example6: {
        summary: 'Example of changing city',
        value: {
          city: 'new city',
        },
      },
      example7: {
        summary: 'Example of changing everything',
        value: {
          name: 'new name',
          email: 'new email',
          password: 'new password',
          address: 'new address',
          phone: 'new phone',
          country: 'new country',
          city: 'new city',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User modified successfully :)',
  })
  @ApiResponse({ status: 400, description: 'The format used is incorrect :(' })
  @ApiResponse({
    status: 401,
    description: 'You do not have authorization for this route :|',
  })
  @ApiResponse({ status: 404, description: 'User not modified :(' })
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully :)',
  })
  @ApiResponse({ status: 400, description: 'The format used is incorrect :(' })
  @ApiResponse({
    status: 401,
    description: 'You do not have authorization for this route :|',
  })
  @ApiResponse({ status: 404, description: 'User not deleted :(' })
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
