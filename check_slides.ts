import prisma from './src/lib/prisma';

async function main() {
  const slides = await prisma.slide.findMany({
    orderBy: { order: 'asc' },
  });
  console.log(JSON.stringify(slides, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
