import { IsEnum, IsOptional, IsString } from 'class-validator';
import { paginationDto } from './../../common/dto/pagination-query-dto';
import { Bug_status, Priority } from '@prisma/client';
export class getAllBugsDto extends paginationDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(Bug_status)
    status?: Bug_status;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsString()
    sort?: "asc" | "desc" = "desc"

}