import { Injectable } from "@nestjs/common";
import { IUserRepository } from "./user.repository.interface";
import { PrismaService } from "src/common/infra/database/prisma.service";
import { Prisma, User } from "@prisma/client";
import { UserPaginateDTO } from "../dto/user-paginate.dto";


@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async detail(id: string) {
        return await this.prismaService.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                email: true,
                person: true,
                is_active: true
            }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where: {
                email
            }
        })
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prismaService.user.create({
            data
        })
    }

    async update(data: Prisma.UserUpdateInput, where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prismaService.user.update({
            data,
            where
        });
    }

    async paginate(params: UserPaginateDTO) {
        const {
            search = '',
            page = 1,
            pageSize = 10,
            order = 'asc',
            active,
        } = params;

        const offset = pageSize * (page - 1);

        const whereClause: Prisma.UserWhereInput = {
            ...(typeof active === 'boolean' && { is_active: active }),
            person: {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        };

        return this.prismaService.user.findMany({
            select: {
                id: true,
                is_active: true,
                email: true,
                created_at: true,
                updated_at: true,
                person: true,
            },
            where: whereClause,
            take: +pageSize,
            skip: offset,
            orderBy: {
                person: {
                    name: order as Prisma.SortOrder,
                },
            },
        });
    }

}