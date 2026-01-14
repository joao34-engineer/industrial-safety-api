import { db } from '../../src/db/connection.ts'
import { users, habits, entries, tags, habitTags} from '../../src/db/schema.ts'
import { sql } from 'drizzle-orm'
import { execSync } from 'child_process'


export default async function setup() {
  console.log('setting up the test db...')
  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE;`);
    execSync(`npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema=./src/db/schema.ts --dialect=postgresql`, 
      { 
        stdio: 'inherit',
        cwd: process.cwd()
      }
    );
    console.log('test db is set up')
  } catch (e) {
    console.error(' Fail to setup test db', e)
    throw e
  
  }

  return async () => {
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE;`);
      await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE;`);
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE;`);
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE;`);
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE;`);
      process.exit(0)
    } catch (e) {
      console.error(' Fail to setup test db', e)
      throw e
    }
  }
}