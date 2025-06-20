import { Prisma, User } from "@prisma/client";
import { UserPaginateDTO } from "../dto/user-paginate.dto";

export abstract class IUserRepository {
    abstract findByEmail(email: string): Promise<User | null>;
    abstract create(data: Prisma.UserCreateInput): Promise<User>;
    abstract update(data: Prisma.UserUpdateInput, where: Prisma.UserWhereUniqueInput): Promise<User>;
    abstract paginate(params: UserPaginateDTO);
    abstract detail(id: string);
}