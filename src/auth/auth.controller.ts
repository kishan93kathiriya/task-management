import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() UserCredentialsDTO: UserCredentialsDTO): Promise<void> {
    return this.authService.signUp(UserCredentialsDTO);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDTO: UserCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }
}
