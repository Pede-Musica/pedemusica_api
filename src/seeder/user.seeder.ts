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
            name: 'Felipe Yuiti Sasaki',
            email: 'felipe.sasaki95@gmail.com',
            type: 1,
        },
    ];

    await prisma.$transaction(async (tx) => {
        for (const user of users) {
            const userExists = await tx.user.findUnique({
                where: {
                    email: user.email,
                },
            });

            if (userExists) {
                continue;
            }
            const hashedPassword = await bcrypt.hash('123456', 10);

            await tx.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: '*',
                },
            });
        }
    });

    await prisma.$disconnect();
    return true;
}
