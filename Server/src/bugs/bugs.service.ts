import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Bug, Bug_status, Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { createBugsDto, updateBugsDto, UpdateStatusDto, AssignBugDto, UpdatePriorityDto } from './dto/bugs.dto';
import { getAllBugsDto } from './dto/get.allbugs.dto';
import { getPagination, paginationResponse } from 'src/common/utils/pagination';

@Injectable()
export class BugsService {
    constructor(private prisma: PrismaService) { }
    async createBugs(userId: string, data: createBugsDto) {
        const { title, description, priority } = data
        const bugs = await this.prisma.bug.create({
            data: {
                title,
                description,
                priority,
                reporterId: userId

            },
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        })
        return {
            message: "bugs created successfully",
            bugs
        }
    }
    // get all bugs
    async getAllbugs(query: getAllBugsDto) {
        const { limit = 10, page = 1, search, status, priority, sort } = query
        const { skip, take } = getPagination(page, limit)
        const where: Prisma.BugWhereInput = {}
        if (search) {
            where.title = {
                contains: search,
                mode: "insensitive"
            }
        }

        if (status) {
            where.status = status
        }
        if (priority) {
            where.priority = priority
        }
        // get all bugs together

        const [bugs, total] = await Promise.all([
            this.prisma.bug.findMany({
                where,
                skip,
                take,

                include: {
                    reporter: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true
                        }
                    }
                    ,
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true
                        }
                    }
                },

                orderBy: {
                    createdAt: sort
                }

            }),
            this.prisma.bug.count({
                where
            })

        ]);

        return paginationResponse(bugs, total, page, limit)
    }
    // get the bugs by id
    async getBugsById(bugId: string) {
        const bug = await this.prisma.bug.findUnique({
            where: {
                id: bugId
            },
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }

        })
        if (!bug) {
            throw new NotFoundException("Bug not found");
        }
        return {
            message: "bugs fetched successfully",
            bug
        }
    }

    //update bugs bugs by id///
    async updateBugs(bugId: string, payload: updateBugsDto) {
        const { title, description, priority } = payload
        const findTheBug = await this.prisma.bug.findUnique({
            where: {
                id: bugId
            }
        })
        if (!findTheBug) throw new NotFoundException("bug not found")

        const updateTheBug = await this.prisma.bug.update({
            where: {
                id: bugId
            },
            data: {
                title,
                description,
                priority
            }
        })
        return {
            message: "update the bug successfully",
            updateTheBug
        }
    }

    // update bug status by id(only for developer and Admin)
    async updateBugStatus(bugId: string, payload: UpdateStatusDto) {
        const { status } = payload
        const bug = await this.prisma.bug.update({
            where: {
                id: bugId
            },
            data: {
                status
            }
        })
        if (!bug) {
            throw new NotFoundException("Bug not found");
        }
        return {
            message: "bug status updated successfully",
            bug
        }
    }
    // assegned the bugs to the developer
    async assignTheBugs(bugId: string, payload: AssignBugDto) {
        const { assignedToId } = payload
        const user = await this.prisma.user.findUnique({
            where: {
                id: assignedToId
            }
        })
        if (!user) throw new NotFoundException("user not found")
        if (user.role !== Role.DEVELOPER) {
            throw new NotAcceptableException("only developer can be assigned")
        }

        const bug = await this.prisma.bug.update({
            where: {
                id: bugId
            },
            data: {
                assignedToId,
                status: Bug_status.IN_PROGRESS
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        })
        if (!bug) {
            throw new NotFoundException("Bug not found");
        }
        return {
            message: "bug assigned successfully",
            bug
        }
    }

    // unassign bug
    async unassignBug(bugId: string) {
        const bug = await this.prisma.bug.findUnique({ where: { id: bugId } })
        if (!bug) throw new NotFoundException('Bug not found')
        const updated = await this.prisma.bug.update({
            where: { id: bugId },
            data: { assignedToId: null, status: Bug_status.OPEN }
        })
        return { message: 'Bug unassigned successfully', bug: updated }
    }

    // change status
    async changePriority(bugId: string, payload: UpdatePriorityDto) {
        const bug = await this.prisma.bug.findUnique({ where: { id: bugId } })
        if (!bug) throw new NotFoundException('Bug not found')
        const updated = await this.prisma.bug.update({
            where: { id: bugId },
            data: { priority: payload.priority }
        })
        return { message: 'Bug priority updated successfully', bug: updated }
    }

    // get my bugs (reported by me)
    async getMyBugs(userId: string, query: getAllBugsDto) {
        const { limit = 10, page = 1, search, status, priority, sort } = query
        const { skip, take } = getPagination(page, limit)
        const where: Prisma.BugWhereInput = { assignedToId: userId }
        if (search) where.title = { contains: search, mode: 'insensitive' }
        if (status) where.status = status
        if (priority) where.priority = priority
        const [bugs, total] = await Promise.all([
            this.prisma.bug.findMany({
                where, skip, take,
                include: {
                    assignedTo: { select: { id: true, name: true, email: true } },
                    reporter: { select: { id: true, name: true, email: true } }
                },

                orderBy: { createdAt: sort }
            }),
            this.prisma.bug.count({ where })
        ])
        return paginationResponse(bugs, total, page, limit)
    }


    // delete bug
    async deleteBug(bugId: string) {
        const bug = await this.prisma.bug.findUnique({ where: { id: bugId } })
        if (!bug) throw new NotFoundException('Bug not found')
        await this.prisma.bug.delete({ where: { id: bugId } })
        return { message: 'Bug deleted successfully' }
    }

}
