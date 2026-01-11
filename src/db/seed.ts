import {db} from './connection.ts'
import {users, habits, entries, tags, habitTags} from './schema.ts'


const seed = async () => {
   console.log(' Starting database seed...')
}

try {
  console.log('Clearing existing data...')
  await db.delete(entries)
  await db.delete(habits)
  await db.delete(users)
  await db.delete(tags)
  await db.delete(habitTags)

  console.log('creating demo users...')
const [demoUser] = await db.insert(users).values({
  email: 'RZs9S@example.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',

})
.returning()

console.log('Creating tags...')
const [heatlhTag] = await db.insert(tags).values({
  name: 'Health',
  color: '#00FF00',
})
.returning()

const [exerciseHabit] = await db.insert(habits).values({
  userId: demoUser.id,
  name: 'Exercise',
  description: 'Go for a walk',
  frequency: 'Daily',
  targetCount: 1,
})
.returning()

await db.insert(habitTags).values({
  habitId: exerciseHabit.id,
  tagId: heatlhTag.id,
})


console.log(' Adding completion eentries...')

const today = new Date()
today.setHours(12, 0, 0, 0)

for (let i = 0; i < 7; i++) {
  const date = new Date(today)
  date.setDate(date.getDate() - i)

  await db.insert(entries).values({
    habitId: exerciseHabit.id,
    completionDate: date,
  })
}

console.log('DB seeded successfully!')
console.log('user credenntials:')
console.log(`email: ${demoUser.email}`)
console.log(`password: ${demoUser.password}`)
console.log(`username: ${demoUser.username}`)
console.log(`firtName: ${demoUser.firstName}`)
console.log(`lastName: ${demoUser.lastName}`)
} catch (e) {
  console.error('Seed failed',e)
  process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
  .then(() => process.exit(0))
  .catch((e) => process.exit(1))
}

export default seed