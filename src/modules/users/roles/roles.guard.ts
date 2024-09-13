import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('authHeader not found');
    }

    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('token not found');
    }

    let user;
    try {
      user = this.jwtService.verify(token);
    } catch (error) {
      console.error('error', error.message);
      throw new ForbiddenException('invalid token');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Forbiden resource');
    }

    return true;
  }
}
