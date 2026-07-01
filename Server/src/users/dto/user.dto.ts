import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class userUpdateDto {
    @IsEmail()
    @IsOptional()
    email!: string;

    @IsPhoneNumber("BD")
    @IsOptional()
    phone!: string;

    @IsString()
    name!: string
}