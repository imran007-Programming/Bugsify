import { Role } from '@prisma/client';
import { Request } from 'express';
export interface AuthRequest extends Request {
    user: {
        userId: string,
        email: string,
        role: Role
    }
}