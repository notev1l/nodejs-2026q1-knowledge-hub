import { PrismaClient, Prisma, ArticleStatus, UserRole } from '@prisma/client';
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
        role: UserRole.ADMIN,
    },
    {
        login: "jack",
        password: "64t",
        role: UserRole.VIEWER
    },
    {
        login: "tom",
        password: "720",
        role: UserRole.EDITOR
    },
]

const categoryData: Prisma.CategoryCreateInput[] = [
    {
        name: "Technology",
        description: "Articles about software, hardware and tech trends"
    },
    {
        name: "Science",
        description: "Articles about scientific discoveries and research"
    },
    {
        name: "Programming",
        description: "Tutorials and guides about programming languages and tools"
    },
]

const tagData: Prisma.TagCreateInput[] = [
  { name: 'nestjs' },
  { name: 'nodejs' },
  { name: 'typescript' },
  { name: 'prisma' },
  { name: 'postgresql' },
];

export async function main() {
    for (const user of userData) {
        const exists = await prisma.user.findFirst({ where: { login: user.login } });

        if (!exists) await prisma.user.create({ data: user })    
    }

    for (const category of categoryData) {
        const exists = await prisma.category.findFirst({ where: { name: category.name } });
        if (!exists) await prisma.category.create({ data: category });
    }
 
    for (const tag of tagData) {
        const exists = await prisma.tag.findFirst({ where: { name: tag.name } });
        if (!exists) await prisma.tag.create({ data: tag });
    }

    const fred = await prisma.user.findFirst({ where: { login: 'fred' } });
    const jack = await prisma.user.findFirst({ where: { login: 'jack' } });
    const tom = await prisma.user.findFirst({ where: { login: 'tom' } });
    const techCategory = await prisma.category.findFirst({ where: { name: 'Technology' } });
    const scienceCategory = await prisma.category.findFirst({ where: { name: 'Science' } });
    const programmingCategory = await prisma.category.findFirst({ where: { name: 'Programming' } });
        
    const articleData: Prisma.ArticleCreateInput[] = [
        {
            title: 'Getting Started with NestJS',
            content: 'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications.',
            status: ArticleStatus.PUBLISHED,
            user: { connect: { id: jack.id } },
            category: { connect: { id: programmingCategory.id } },
            tags: { connect: [{ name: 'nestjs' }, { name: 'nodejs' }, { name: 'typescript' }] },
        },
        {
            title: 'Prisma ORM Deep Dive',
            content: 'Prisma is a next-generation ORM that makes database access easy with an auto-generated query builder.',
            status: ArticleStatus.PUBLISHED,
            user: { connect: { id: tom.id } },
            category: { connect: { id: programmingCategory.id } },
            tags: { connect: [{ name: 'prisma' }, { name: 'typescript' }, { name: 'postgresql' }] },
        },
        {
            title: 'PostgreSQL Performance Tips',
            content: 'Learn how to optimize your PostgreSQL database with indexing, query planning and connection pooling.',
            status: ArticleStatus.PUBLISHED,
            user: { connect: { id: fred.id } },
            category: { connect: { id: techCategory.id } },
            tags: { connect: [{ name: 'postgresql' }, { name: 'prisma' }] },
        },
        {
            title: 'The Future of TypeScript',
            content: 'TypeScript continues to evolve with new features that make JavaScript development safer and more productive.',
            status: ArticleStatus.DRAFT,
            user: { connect: { id: fred.id } },
            category: { connect: { id: techCategory.id } },
            tags: { connect: [{ name: 'typescript' }, { name: 'nodejs' }] },
        },
        {
            title: 'Quantum Computing Explained',
            content: 'Quantum computing leverages quantum mechanical phenomena to perform computations beyond classical computers.',
            status: ArticleStatus.DRAFT,
            category: { connect: { id: scienceCategory.id } },
        },
    ]

    for (const article of articleData) {
        const exists = await prisma.article.findFirst({ where: { title: article.title } });
        if (!exists) await prisma.article.create({ data: article });
    }

    const article1 = await prisma.article.findFirst({ where: { title: 'Getting Started with NestJS' } });
    const article2 = await prisma.article.findFirst({ where: { title: 'Prisma ORM Deep Dive' } });
    const article3 = await prisma.article.findFirst({ where: { title: 'PostgreSQL Performance Tips' } });
    const article4 = await prisma.article.findFirst({ where: { title: 'The Future of TypeScript' } });
    
    const commentData: Prisma.CommentCreateInput[] = [
    {
        content: 'Great article! Really helped me understand NestJS basics.',
        article: { connect: { id: article1.id } },
        user: { connect: { id: jack.id } },
    },
    {
        content: 'Prisma has completely changed how I interact with databases.',
        article: { connect: { id: article2.id } },
        user: { connect: { id: fred.id } },
    },
    {
        content: 'The indexing tips were very useful, saw immediate performance gains.',
        article: { connect: { id: article3.id } },
        user: { connect: { id: tom.id } },
    },
    {
        content: 'Looking forward to the full article on TypeScript 6!',
        article: { connect: { id: article4.id } },
    },
    ];

    for (const comment of commentData) {
        const exists = await prisma.comment.findFirst({ where: { content: comment.content } });
        if (!exists) await prisma.comment.create({ data: comment });
    }

    console.log('Seed completed successfully');
}

main()
    .catch(e => {
        console.error('Seed failed: ', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});