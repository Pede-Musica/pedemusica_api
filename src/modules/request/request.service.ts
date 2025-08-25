import { BadRequestException, Injectable } from "@nestjs/common";
import { Person, Prisma } from "@prisma/client";
import { RequestCreateDTO } from "./dto/request-create.dto";
import { PrismaService } from "src/common/infra/database/prisma.service";
import { RequestPaginateDTO } from "./dto/request-paginate.dto";
import { RequestUpdateFavoriteDTO } from "./dto/request-update-favorite.dto";


@Injectable()
export class RequestService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: RequestCreateDTO): Promise<any> {

        try {

            const client = await this.prismaService.client.findUnique({
                where: {
                    slug: data.client_slug
                }
            })

            const newRequest = await this.prismaService.requests.create({
                data: {
                    user_name: data.user_name,
                    table: data.table,
                    song_name: data.song_name,
                    favorite: false,
                    client_id: client.id
                }
            })

            return newRequest;
        }
        catch (err) {
            throw new BadRequestException('Erro ao criar pedido')
        }
    }

    async paginate(data: RequestPaginateDTO) {
        const filter = data?.filter ?? 'today';
        const favorite = data?.favorite ?? null;

        const where: any = {};

        if (favorite === 'true') {
            where.favorite = true;
        }

        if (filter === 'today') {
            const date = new Date();
            date.setHours(date.getHours() - 12);
            where.created_at = {
                gte: date
            };
        }

        const requests = await this.prismaService.requests.findMany({
            where,
            orderBy: {
                created_at: 'desc'
            }
        });

        return {
            requests: requests,
        };
    }

    async update(data: RequestUpdateFavoriteDTO) {

        const changeType = data.change ?? ''

        try {

            switch (changeType) {
                case 'favorite': {
                    const response = await this.prismaService.requests.update({
                        where: {
                            id: Number(data.id)
                        },
                        data: {
                            favorite: true
                        }
                    })

                    if (response) {
                        return {
                            message: 'Pedido favoritado com sucesso'
                        }
                    }

                }

                case 'unfavorite': {
                    const response = await this.prismaService.requests.update({
                        where: {
                            id: Number(data.id)
                        },
                        data: {
                            favorite: false
                        }
                    })

                    if (response) {
                        return {
                            message: 'Pedido removido da lista de favoritos'
                        }
                    }
                }

                case 'done': {
                    const response = await this.prismaService.requests.update({
                        where: {
                            id: Number(data.id)
                        },
                        data: {
                            done: true
                        }
                    })
                    if (response) {
                        return {
                            message: 'Pedido marcado como "tocado"'
                        }
                    }
                }

                case 'undone': {
                    const response = await this.prismaService.requests.update({
                        where: {
                            id: Number(data.id)
                        },
                        data: {
                            done: false
                        }
                    })
                    if (response) {
                        return {
                            message: 'Pedido marcado como "Não tocado"'
                        }
                    }
                }
            }

            throw new BadRequestException('Falha ao atualizar pedido')

        }
        catch (err) {
            throw new BadRequestException('Falha ao atualizar pedido', err)
        }
    }
}