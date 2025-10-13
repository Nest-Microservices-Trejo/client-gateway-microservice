import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { JwtResponse } from '../interfaces/jwt-decoded-payload.interface';
import { NATS_SERVICE } from '../../config/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      console.log('hola');
      const { user, token: newToken } = await firstValueFrom<JwtResponse>(
        this.client.send('auth.verify.user', { token }),
      );
      console.log(user, token);
      request['user'] = user;

      request['token'] = newToken;
    } catch {
      throw new UnauthorizedException('Token not valid');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
