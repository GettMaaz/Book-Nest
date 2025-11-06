// Using better-sqlite3 wrapper instead of Prisma Client due to engine binary issues
import { dbClient } from './db'

export const prisma = dbClient as any
