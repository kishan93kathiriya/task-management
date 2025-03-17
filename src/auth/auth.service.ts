import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  signUp(UserCredentialsDTO: UserCredentialsDTO): Promise<void> {
    return this.usersRepository.createUser(UserCredentialsDTO);
  }

  signIn(
    authCredentialsDTO: UserCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.usersRepository.authenticateUser(authCredentialsDTO);
  }
}
