import { PrismaClient } from "../generated/prisma/client.js"
// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config"

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not set in .env");
}

// const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const adapter = new PrismaPg({ connectionString: dbUrl });

const prisma = new PrismaClient({adapter: adapter});

export { prisma };