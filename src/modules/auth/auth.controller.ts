import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from 'src/dtos/LoginUser.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    type: LoginUserDto,
    examples: {
      example: {
        summary: 'Example of login a new user',
        value: {
          email: 'lionel.messi@example.com',
          password: 'we.love.messi!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User logged in successfully :)',
  })
  @ApiResponse({ status: 400, description: 'The format used is incorrect :(' })
  @ApiResponse({ status: 404, description: 'The user is not logged in :(' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.generateToken(user);

    return { user, token };
  }
}
