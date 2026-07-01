import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }
    async createComment(userId: string, bugId: string, payload: any) {
        const comment = await this.prisma.comment.create({
            data: {
                userId,
                bugId,
                ...payload
            }
        })
        return {
            message: "comment created successfully",
            comment
        }
    }
}
