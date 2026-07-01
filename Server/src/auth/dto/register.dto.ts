import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator"
import { Role } from '@prisma/client';
export class RegisterDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name!: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsPhoneNumber("BD")
    phone?: string;

    @IsEnum(Role)
    role!: Role;

    @MaxLength(10)
    @IsString()
    @MinLength(6)
    password!: string
}