import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { Observable } from "rxjs";
import { ROLE_KEY } from "../decoraters/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        // Get roles from decorator
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLE_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        )
        if (!requiredRoles) return true
        // get the currect http request
        const request = context.switchToHttp().getRequest();
        // get the user info from jwtguard
        const user = request.user;
        if (!user) {
            throw new ForbiddenException("User not found")
        }
        const hasRole = requiredRoles.includes(user.role);
        // if not available the role deny the access
        if (!hasRole) {
            throw new ForbiddenException("you are not authorized to this resource")
        }

        return true;
    }
}

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }
//     CanActivate(context: ExecutionContext): boolean {
//         //  get the roles from decorator
//         const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
//             ROLE_KEY, [
//             context.getHandler(),
//             context.getClass()
//         ]
//         )
//         if (!requiredRoles) return true
//         const request = context.switchToHttp().getRequest();
//         const user = request.user;
//         if (!user) throw new ForbiddenException("User not found")
//         const hasRole = requiredRoles.includes(user.role)
//         if (!hasRole) {
//             throw new ForbiddenException("you are not authorized to this resource")
//         }

//         return true
//     }
// }