const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root:@localhost:3306/thpt_edison');
const prisma = new PrismaClient({ adapter });

async function main() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      thumbnail: true,
      createdAt: true,
      updatedAt: true
    }
  });
  console.log(JSON.stringify(posts, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
