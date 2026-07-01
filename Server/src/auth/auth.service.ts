import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { Role } from '@prisma/client';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }
    //  generate token
    private async generateToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        // accessToken
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as any
        })
        return {
            accessToken,
            refreshToken
        }
    }


    private excludePassword(user: User) {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
    // Register
    async register(payload: RegisterDto) {
        const { name, email, phone, password, role } = payload
        // Check if the email and password is exsist or not
        if (!email && !phone) {
            throw new BadRequestException("Email or Phone is required")
        }


        const userExist = await this.prisma.user.findFirst({
            where: {
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : [])
                ]

            }
        })
        // if user Exsist show an error
        if (userExist) {
            throw new BadRequestException("User with this email or phone already exist")
        }
        if (role === Role.ADMIN) {
            throw new BadRequestException("Admin user can't be created here")
        }
        // Hased password//
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.prisma.user.create({
            data: {
                name,
                email: email || null,
                phone: phone || null,
                password: hashedPassword,
                role
            }
        })


        // Token generate
        const token = await this.generateToken(user)

        return {
            message: "user Created Successfully",
            token,
            user: this.excludePassword(user)
        }

    }
    // Login
    async login(payload: LoginDto) {
        const { email, phone, password } = payload;
        if (!email && !phone) {
            throw new BadRequestException("Email or Phone is required")
        }
        // check the user is exisist//
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : [])
                ]
            }
        })

        if (!user) {
            throw new UnauthorizedException("invalid credientials")
        }

        // password matched
        const ispasswordMathced = await bcrypt.compare(password, user.password)
        if (!ispasswordMathced) {
            throw new UnauthorizedException("Invalid crediantials")
        }
        // saved the token in cookies

        const token = await this.generateToken(user)

        return {
            message: "Login successfully",
            ...token,
            user: this.excludePassword(user)
        }
    }
    // getUserProfile
    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new BadRequestException("User not found")
        }
        return {
            user: this.excludePassword(user)
        }
    }
    async refreshToken(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new BadRequestException("User not found")
        }
        return this.generateToken(user)

    }
}
