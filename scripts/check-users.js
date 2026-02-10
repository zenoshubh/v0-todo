import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

async function checkUsers() {
  try {
    // Generate Prisma client first
    console.log('[v0] Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    const adapter = new PrismaPg({
      connectionString: process.env.NEON_DATABASE_URL,
    })

    const prisma = new PrismaClient({
      adapter,
    })
    
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
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('[v0] Error checking users:', error.message)
    process.exit(1)
  }
}

checkUsers()
