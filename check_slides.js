const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slides = await prisma.slide.findMany({
    orderBy: { order: 'asc' },
  });
  console.log(JSON.stringify(slides, null, 2));
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
