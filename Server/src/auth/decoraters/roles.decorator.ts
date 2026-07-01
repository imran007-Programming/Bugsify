import { SetMetadata } from "@nestjs/common"
import { Role } from "@prisma/client"

export const ROLE_KEY = "roles"

export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLE_KEY, roles)
}