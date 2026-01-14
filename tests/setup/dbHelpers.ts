import {db} from '../../src/db/connection.ts'
import {users, habits, entries, tags, type NewUser, type newHabit, habitTags} from '../../src/db/schema.ts'
import {hashPassword} from '../../src/utils/passwords.ts'
import {generateToken} from '../../src/utils/jwt.ts'

export const createTestUser = async (userData: Partial<NewUser> = {} ) => {
  const defaultData = {
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    username: `test-${Date.now()}-${Math.random()}`,
    password: 'password',
    firstName: 'John',
    lastName: 'Doe',
    ...userData,
  }

  const hashedPassword = await hashPassword(defaultData.password)
  const [user] = await db.insert(users).values({
    ...defaultData,
    password: hashedPassword,
  })
  .returning()

  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  return {token, user, rawPassword: defaultData.password}
}

export const createTestHabit = async (userId: string, habitData: Partial<newHabit>) => {
  const defaultData = { 
    name: `Test habit ${Date.now()}`,
    description: 'A test habit',
    frequency: 'Daily',
    targetCount: 1,
    ...habitData,
  }

  const [habit] = await db.insert(habits).values({
    userId,
    ...defaultData,
  })
  .returning()

  return habit 
}


export const cleanUpDataBase = async () => {
  await db.delete(entries)
  await db.delete(habits)
  await db.delete(users)
  await db.delete(habitTags)
  await db.delete(tags)
}