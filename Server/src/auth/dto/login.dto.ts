import { IsEmail, MaxLength, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    @IsPhoneNumber("BD")
    phone?: string;

    @MinLength(6)
    @IsString()
    @MaxLength(10)
    password!: string;
}