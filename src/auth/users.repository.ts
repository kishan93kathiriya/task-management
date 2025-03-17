import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private JWTService: JwtService,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(userCredentialsDTO: UserCredentialsDTO): Promise<void> {
    const { username, password } = userCredentialsDTO;

    // Hash and Store
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
      console.log(error);
    }
  }

  async authenticateUser(
    userCredentialsDTO: UserCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = userCredentialsDTO;

    const user = await this.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.JWTService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
