import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })


async function main() {
    const plans = [
        { name: 'Basic Monthly', price: 29, durationDays: 30 },
        { name: 'Standard Monthly', price: 49, durationDays: 30 },
        { name: 'Annual', price: 399, durationDays: 365 },
    ]
    await prisma.plan.createMany({
        data: plans,
        skipDuplicates: true,
    })

}

try {
    await main()
} catch (e) {
    console.error(e)
    process.exit(1)
} finally {
    await prisma.$disconnect()
}
