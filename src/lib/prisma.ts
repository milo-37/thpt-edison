import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient
}

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error(
      'DATABASE_URL is not set. Please configure .env file. ' +
      'See .env.example for reference.'
    )
  }
  const adapter = new PrismaMariaDb(dbUrl)
  return new PrismaClient({ adapter })
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient()
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  prisma = globalForPrisma.prisma
}

export { prisma }
export default prisma


