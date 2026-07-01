import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    private excludePassword(user: User) {
        const { password, ...rest } = user
        return rest
    }

    async getAllusers() {
        const users = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return {
            message: 'Users retrieved successfully',
            users: users.map((user) => this.excludePassword(user))
        }
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        return { user: this.excludePassword(user) }
    }

    async updateUser(id: string, data: Partial<Pick<User, 'name' | 'email' | 'phone'>>) {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        const updated = await this.prisma.user.update({ where: { id }, data })
        return { message: 'User updated successfully', user: this.excludePassword(updated) }
    }

    async deleteUser(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        await this.prisma.user.delete({ where: { id } })
        return { message: 'User deleted successfully' }
    }

    async blockUser(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        const updated = await this.prisma.user.update({ where: { id }, data: { isBlocked: true } })
        return { message: 'User blocked successfully', user: this.excludePassword(updated) }
    }

    async unblockUser(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        const updated = await this.prisma.user.update({ where: { id }, data: { isBlocked: false } })
        return { message: 'User unblocked successfully', user: this.excludePassword(updated) }
    }
}
