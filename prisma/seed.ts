import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  // Create 50 sample users for pagination demo
  const users = [];
  for (let i = 1; i <= 50; i++) {
    users.push({
      email: `user${i}@example.com`,
      name: `User ${i}`,
      role: i % 3 === 0 ? "admin" : i % 5 === 0 ? "moderator" : "user",
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log("✅ Seeded 50 users successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
