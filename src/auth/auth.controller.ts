import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { ApiErrors } from '../enums/ApiErrors.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      refreshToken,
      accessToken,
      user: { updatedAt, createdAt, ...response },
    } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return {
      user: response,
      accessToken,
    };
  }

  @Post('register')
  public async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      refreshToken,
      accessToken,
      user: { updatedAt, createdAt, ...response },
    } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return {
      user: response,
      accessToken,
    };
  }

  @Post('refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookie =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];
    console.log(refreshTokenFromCookie);
    if (!refreshTokenFromCookie) {
      this.authService.removeRefreshTokenFromResponse(res);

      throw new UnauthorizedException({
        message: ApiErrors.INVALID_REFRESH_TOKEN,
      });
    }

    const { refreshToken, ...response } = await this.authService.refresh(
      refreshTokenFromCookie,
    );

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('logout')
  public async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);

    return true;
  }
}
