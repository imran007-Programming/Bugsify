import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BugsService } from './bugs.service';
import { AssignBugDto, createBugsDto, updateBugsDto, UpdatePriorityDto, UpdateStatusDto } from './dto/bugs.dto';
import { JwtGuard } from 'src/auth/guards/Jwtguard';
import { AuthRequest } from 'src/common/interface/auth.interface';
import { Roles } from 'src/auth/decoraters/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { getAllBugsDto } from './dto/get.allbugs.dto';

@UseGuards(JwtGuard)
@Controller('bugs')
export class BugsController {
    constructor(private bugService: BugsService) { }

    @Roles(Role.DEVELOPER)
    @UseGuards(RolesGuard)
    @Post('createbug')
    createBug(@Req() req: AuthRequest, @Body() payload: createBugsDto) {
        return this.bugService.createBugs(req.user.userId, payload)
    }

    @Get('allbugs')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    getAllbugs(@Query() query: getAllBugsDto) {
        return this.bugService.getAllbugs(query)
    }

    @Get('mybugs')
    getMyBugs(@Req() req: AuthRequest, @Query() query: getAllBugsDto) {
        return this.bugService.getMyBugs(req.user.userId, query)
    }

    @Get(':bugId')
    getBugsBuId(@Param('bugId') bugId: string) {
        return this.bugService.getBugsById(bugId)
    }


    @Patch(':bugId/update')
    @Roles(Role.USER)
    @UseGuards(RolesGuard)
    updateBugById(@Param('bugId') bugId: string, @Body() payload: updateBugsDto) {
        return this.bugService.updateBugs(bugId, payload)
    }

    @Patch(':bugId/status')
    @Roles(Role.ADMIN, Role.DEVELOPER)
    @UseGuards(RolesGuard)
    updateStatusBugById(@Param('bugId') bugId: string, @Body() payload: UpdateStatusDto) {
        return this.bugService.updateBugStatus(bugId, payload)
    }

    @Patch(':bugId/priority')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    changePriority(@Param('bugId') bugId: string, @Body() payload: UpdatePriorityDto) {
        return this.bugService.changePriority(bugId, payload)
    }

    @Patch(':bugId/assigned')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    assignedBug(@Param('bugId') bugId: string, @Body() payload: AssignBugDto) {
        return this.bugService.assignTheBugs(bugId, payload)
    }

    @Patch(':bugId/unassign')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    unassignBug(@Param('bugId') bugId: string) {
        return this.bugService.unassignBug(bugId)
    }
    @Delete(':bugId')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    deleteBug(@Param('bugId') bugId: string) {
        return this.bugService.deleteBug(bugId)
    }

}
