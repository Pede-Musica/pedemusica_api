import { Client, Prisma, User } from "@prisma/client";

export abstract class IClientRepository {
    abstract findMany(id: string): Promise<Client[] | null>;
}