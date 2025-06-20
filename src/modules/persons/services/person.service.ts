import { Injectable } from "@nestjs/common";
import { PersonRepository } from "../repositories/person.repository";
import { Person, Prisma } from "@prisma/client";


@Injectable()
export class PersonService {
    constructor(private readonly personRepository: PersonRepository) { }

    async create(data: Prisma.PersonCreateInput): Promise<Person> {
        return this.personRepository.create(data);
    }
}