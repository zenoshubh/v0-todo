import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.NEON_DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function checkUsers() {
  try {
    console.log('[v0] Checking for users in database...')
    const users = await prisma.user.findMany()
    
    if (users.length === 0) {
      console.log('[v0] No users found in the database.')
    } else {
      console.log(`[v0] Found ${users.length} user(s):`)
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. Email: ${user.email}, Name: ${user.name || 'N/A'}, Created: ${user.createdAt}`)
      })
    }
  } catch (error) {
    console.error('[v0] Error checking users:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
