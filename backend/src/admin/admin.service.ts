
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async UpdateRole(id: string, adminId: string, role: string) 
    {
          return this.prisma.user.update({
            where: { id },
            data: { role },
          });
    }
}