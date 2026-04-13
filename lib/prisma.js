import { PrismaClient } from "@prisma/client";

let prisma;

try {
  prisma = global.prisma || new PrismaClient();

  if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }
} catch (e) {
  console.warn("Prisma initialization failed:", e.message);
  prisma = {
    home: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    user: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
  };
}

export { prisma };
