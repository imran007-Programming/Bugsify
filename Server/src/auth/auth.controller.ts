import { RegisterDto } from './dto/register.dto';
import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/Jwtguard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';


@Controller('auth')
export class AuthController {
    constructor(private authSerrvice: AuthService, private jwtService: JwtService) { }
    @Post('register')
    async register(@Body() payload: RegisterDto) {
        return this.authSerrvice.register(payload)
    }
    // login
    @Post('login')
    async login(@Body() payload: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authSerrvice.login(payload)
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        })
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return {
            message: result.message,
            user: result.user,

        }
    }
    // getProfile
    @UseGuards(JwtGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        return this.authSerrvice.getProfile(req?.user?.userId)
    }
    // Refresh Token
    @Post('refresh-token')
    async refreshToken(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedException("RefreshToken is missing")
        }
        const verifyUser = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_SECRET
        })
        const token = await this.authSerrvice.refreshToken(verifyUser.id)

        res.cookie('accessToken', token.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        })
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return {
            message: "Token refreshed successfully",
            ...token
        }
    }

    // logout
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return {
            message: "user logout successfully"
        }
    }


}

