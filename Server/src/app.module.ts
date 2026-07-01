import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BugsModule } from './bugs/bugs.module';
import { CommentsModule } from './comments/comments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedService } from 'prisma/admin_seed/admin-seed';
import { UsersModule } from './users/users.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BugsModule,
    CommentsModule,
    DashboardModule,

  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule { }
