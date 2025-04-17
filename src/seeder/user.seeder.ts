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
                phone: '43999001381',
                phone2: '',
                address: '',
                cpf_cnpj: '',
            },
            user: {
                is_active: true,
                password: 'abc123',
                email: 'felipe.sasaki95@gmail.com',
            }
        },
    ];

    await prisma.$transaction(async (tx) => {
        for (const user of users) {
            const userExists = await tx.user.findUnique({
                where: {
                    email: user.user.email,
                },
            });

            if (userExists) {
                continue;
            }

            const hashedPassword = await bcrypt.hash(user.user.password, 10);

            const person = await tx.person.create({
                data: {
                    name: user.person.name,
                    phone: user.person.phone,
                    phone2: user.person.phone2,
                    address: user.person.address,
                    cpf_cnpj: user.person.cpf_cnpj,
                },
            });

            const newUser = await tx.user.create({
                data: {
                    is_active: true,
                    password: hashedPassword,
                    person_id: person.id,
                    email: user.user.email
                }
            })
        }
    });

    await prisma.$disconnect();
    return true;
}
