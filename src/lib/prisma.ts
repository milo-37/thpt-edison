import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root:@localhost:3306/thpt_edison')
  prisma = new PrismaClient({ adapter })
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root:@localhost:3306/thpt_edison')
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  prisma = globalForPrisma.prisma
}

export { prisma }
export default prisma


