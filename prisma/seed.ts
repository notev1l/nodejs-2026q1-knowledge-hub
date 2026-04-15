import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

const userData: Prisma.UserCreateInput[] = [
    {
        login: "fred",
        password: "123",
        role: "ADMIN",
    },
    {
        login: "jack",
        password: "64t",
        role: "VIEWER"
    },
    {
        login: "tom",
        password: "720",
        role: "EDITOR"
    },
]

export async function main() {
    for (const user of userData) {
        const exists = await prisma.user.findFirst({
            where: { login: user.login },
        });

        if (!exists) await prisma.user.create({ data: user })    
    }
}

main()