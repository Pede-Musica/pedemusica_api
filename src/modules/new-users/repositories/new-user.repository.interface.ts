import { NewUser, Prisma, } from "@prisma/client";

export abstract class INewUserRepository {
    abstract create(data: Prisma.NewUserCreateInput): Promise<NewUser>;
    abstract findByToken(token: string): Promise<NewUser | null>;
    abstract deleteMany(where?: Prisma.NewUserWhereInput): Promise<Prisma.BatchPayload>;
}