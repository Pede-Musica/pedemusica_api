import { Person, Prisma, User } from "@prisma/client";

export abstract class IPersonRepository {
    abstract create(data: Prisma.PersonCreateInput): Promise<Person>;
}