import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 10000,
        timeout: 30000,
    },
});

export async function sectorSeeder() {
    const sectors = [
        {
            name: 'Câmara fria',
        },
        {
            name: 'Setor A',
        },
        {
            name: 'Setor B',
        },
        {
            name: 'Stash',
        },
    ];

    await prisma.$transaction(async (tx) => {
        for (const sector of sectors) {
            const exists = await tx.sector.findUnique({
                where: {
                    name: sector.name,
                },
            });

            if (exists) {
                continue;
            }

            await tx.sector.create({
                data: {
                    name: sector.name,
                },
            });
        }
    });

    await prisma.$disconnect();
    return true;
}
