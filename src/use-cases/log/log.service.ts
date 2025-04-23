import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

interface props {
    user_id: string
    type: string
    action: string
    before: string
    after: string
}

interface propsService {
    service: string,
    class: string,
    success: boolean,
    log: string
}

interface propsUsers {
    user_id: string,
    class: string,
    success: boolean,
    log: string
}
@Injectable()
export class LogService {

    constructor(
        public prismaService: PrismaService
    ) { }

    async log(data: props) {

        // await this.prismaService.logSystem.create({
        //     data: {
        //         user_id: data.user_id,
        //         type: data.type,
        //         action: data.action,
        //         before: data.before,
        //         after: data.after
        //     }   
        // })
    }



    async createLogService(data: propsService) {

        try {
            const log = await this.prismaService.logServices.create({
                data: {
                    service: data.service,
                    class: data.class,
                    success: data.success,
                    log: data.log
                }
            })
        }
        catch(err) {
            console.log('Falha ao criar log_services =>', err)
            return false
        }
    }

    async createLogUser(data: propsUsers) {

        try {
            await this.prismaService.logUsers.create({
                data: {
                    user_id: data.user_id,
                    class: data.class,
                    success: data.success,
                    log: data.log
                }
            })
            return true
        }
        catch (err) {
            console.log('Falha ao criar log_users =>', err)
            return false
        }
    }
}
