const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root:@localhost:3306/thpt_edison');
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Fetch current default post thumbnail
  const setting = await prisma.setting.findUnique({
    where: { key: 'defaultPostThumbnailUrl' }
  });
  
  if (!setting || !setting.value) {
    console.log('No defaultPostThumbnailUrl configured in settings yet.');
    await prisma.$disconnect();
    return;
  }
  
  const defaultUrl = setting.value;
  console.log(`Found default post thumbnail in settings: ${defaultUrl}`);

  // 2. Update all posts in database
  const result = await prisma.post.updateMany({
    where: {
      OR: [
        { thumbnail: null },
        { thumbnail: '' },
        { thumbnail: '/uploads/thumbnails/news-default.jpg' },
        { thumbnail: '/uploads/thumbnails/tuyen-sinh-default.jpg' },
      ]
    },
    data: {
      thumbnail: defaultUrl
    }
  });

  console.log(`Successfully updated ${result.count} existing posts to use the default thumbnail!`);
  await prisma.$disconnect();
}

main().catch(console.error);
