import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 10000,
        timeout: 30000,
    },
});

export async function userSeeder() {
    const users = [
        {
            person: {
                name: 'Felipe Yuiti Sasaki',
                email: 'felipe.sasaki95@gmail.com',
                position: 'System Administrator',
                phone: '43999001381',
                phone2: '',
                address: '',
                type: 1,
                cpf_cnpj: '',
                isCostumer: false,
                isProducer: false,
                isUser: true,
                sysAdmin: true
            },
            user: {
                isActive: true,
                password: '123456',
            }
        },
    ];

    await prisma.$transaction(async (tx) => {
        for (const user of users) {
            const userExists = await tx.user.findUnique({
                where: {
                    user: user.person.email,
                },
            });

            if (userExists) {
                continue;
            }

            const hashedPassword = await bcrypt.hash(user.user.password, 10);

            const person = await tx.person.create({
                data: {
                    name: user.person.name,
                    email: user.person.email,
                    position: user.person.position,
                    phone: user.person.phone,
                    phone2: user.person.phone2,
                    address: user.person.address,
                    type: user.person.type,
                    cpf_cnpj: user.person.cpf_cnpj,
                    isCustomer: user.person.isCostumer,
                    isProducer: user.person.isProducer,
                    isUser: user.person.isUser,
                    sysAdmin: user.person.sysAdmin,
                },
            });

            const newUser = await tx.user.create({
                data: {
                    isActive: true,
                    password: hashedPassword,
                    person_id: person.id,
                    user: user.person.email
                }
            })
        }
    });

    await prisma.$disconnect();
    return true;
}
