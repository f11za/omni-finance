import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const prismaClientSingleton = () => {
  // 1. Create a standard Postgres connection pool
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. Wrap it in the Prisma Adapter
  const adapter = new PrismaPg(pool);
  
  // 3. Pass the adapter to the client
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;