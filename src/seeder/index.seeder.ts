import { PrismaClient } from '@prisma/client';
import { userSeeder } from './user.seeder';
import { sectorSeeder } from './sector.seeder';
import { ParamSeeder } from './system-params.seeder';

const prisma = new PrismaClient();

async function indexSeeders() {

  // User seed
  await userSeeder()
    .then(() => {
      console.log('Users finished - ✔️');
    })
    .catch(async (error) => {
      console.error('Error to insert data:', error.message);
      process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());

  // Sector seed
  await sectorSeeder()
    .then(() => {
      console.log('Sectors finished - ✔️');
    })
    .catch(async (error) => {
      console.error('Error to insert data:', error.message);
      process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());

    // Param seed
  await ParamSeeder()
    .then(() => {
      console.log('Params finished - ✔️');
    })
    .catch(async (error) => {
      console.error('Error to insert data:', error.message);
      process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
}



indexSeeders()
  .then(() => {
    console.log('All seeders finished - ✅');
  })
  .catch(async (error) => {
    console.error('Error to insert data:', error.message);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
