import { Module } from '@nestjs/common';
import { BugsController } from './bugs.controller';
import { BugsService } from './bugs.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({

  controllers: [BugsController],
  providers: [BugsService, PrismaService]
})
export class BugsModule { }
