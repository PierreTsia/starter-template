import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'admin@example.com',
      password: 'Admin123!',
      name: 'Admin',
    },
    {
      email: 'user1@example.com',
      password: 'User123!',
      name: 'User One',
    },
    {
      email: 'user2@example.com',
      password: 'User123!',
      name: 'User Two',
    },
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashed,
        name: user.name,
      },
    });
  }

  console.log('Seeded users');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
