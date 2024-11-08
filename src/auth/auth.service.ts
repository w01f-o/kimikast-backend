import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  private readonly EXPIRE_DAY_REFRESH_TOKEN = 7;
  public readonly REFRESH_TOKEN_NAME = 'refreshToken';

  public constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  public async register(dto: AuthDto) {
    const userFromDb = await this.userService.findByEmail(dto.email);

    if (userFromDb) throw new BadRequestException('User already exists');

    const { password, ...user } = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  public async refresh(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const { password, ...user } = await this.userService.findById(result.id);
    const tokens = this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  private issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  public addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      secure: false,
      expires: expiresIn,
      sameSite: 'none',
    });
  }

  public removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      secure: false,
      expires: new Date(0),
      sameSite: 'none',
    });
  }
}
