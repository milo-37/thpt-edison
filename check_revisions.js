const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root:@localhost:3306/thpt_edison');
const prisma = new PrismaClient({ adapter });

async function main() {
  const revisions = await prisma.postRevision.findMany();
  console.log(revisions);
  await prisma.$disconnect();
}

main().catch(console.error);
