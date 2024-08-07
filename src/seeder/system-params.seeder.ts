import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 10000,
        timeout: 30000,
    },
});

export async function ParamSeeder() {
    const list = [
        {
            label: 'company_name',
            value: ''
        },
    ];

    await prisma.$transaction(async (tx) => {
        for (const item of list) {
            const exists = await tx.systemParam.findUnique({
                where: {
                    label: item.label,
                },
            });

            if (exists) {
                continue;
            }

            await tx.systemParam.create({
                data: {
                    label: item.label,
                    value: item.value
                },
            });
        }
    });

    await prisma.$disconnect();
    return true;
}
