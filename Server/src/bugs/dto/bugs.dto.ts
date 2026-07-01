import { Bug_status, Priority } from '.prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class createBugsDto {
    @IsString()
    @MaxLength(50)
    @MinLength(5)
    title!: string;
    @IsString()
    @MaxLength(200)
    @MinLength(20)
    description!: string;

    @IsEnum(Priority)
    priority!: Priority
}

// update bugs dto
export class updateBugsDto {
    @IsString()
    @MaxLength(50)
    @MinLength(5)
    @IsOptional()
    title?: string
    @IsString()
    @MaxLength(200)
    @MinLength(20)
    @IsOptional()
    description?: string
    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority

}

// update Status Dto for developer

export class UpdateStatusDto {
    @IsEnum(Bug_status)
    status!: Bug_status

}

// Assign bug dto Used by an admin to assign a developer.
export class AssignBugDto {
    @IsUUID()
    assignedToId!: string
}

// update Priority Dto
export class UpdatePriorityDto {
    @IsEnum(Priority)
    priority!: Priority
}