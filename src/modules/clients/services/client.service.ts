import { Injectable } from "@nestjs/common";
import { ClientRepository } from "../repositories/client.repository";


@Injectable()
export class ClientService {
    constructor(private readonly clientRepository: ClientRepository) { }

    async findMany(id: string) {
        return await this.clientRepository.findMany(id);
    }
}