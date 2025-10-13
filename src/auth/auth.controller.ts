import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from '../config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterUserDto } from './dto/register-user.dto';
import { catchError } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { Token } from './decorators/token.decorator';
import type { CurrentUser } from './interfaces/current-user.interface';
import { User } from './decorators/current-user.decorator';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  verify(@User() user: CurrentUser, @Token() token: string) {
    return this.client.send('auth.verify.user', { token });
  }
}
