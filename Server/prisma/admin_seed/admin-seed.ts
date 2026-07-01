import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt"
import { Role } from '@prisma/client';
@Injectable()
export class SeedService {
    constructor(private prisma: PrismaService) { }
    async seedAdmin() {
        const admin = await this.prisma.user.findUnique({
            where: { email: process.env.ADMIN_EMAIL! }

        })
        // check if the admin///
        if (admin) return;
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD!,
            10
        );
        await this.prisma.user.create({
            data: {
                name: process.env.ADMIN_NAME!,
                email: process.env.ADMIN_EMAIL!,
                password: hashedPassword,
                role: Role.ADMIN
            }
        })
        console.log("✅✅✅ Admin Created successfully")
    }
}
