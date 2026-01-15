import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import {db} from '../db/connection.ts'
import {users, type NewUser, type User} from '../db/schema.ts'
import {generateToken} from '../utils/jwt.ts'
import {hashPassword} from '../utils/passwords.ts'
import { eq } from 'drizzle-orm'
import { comparePassword } from '../utils/passwords.ts'



export const register = async (
  req: Request<any, any, NewUser>, res: Response) => {

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const hashedPassword = await hashPassword(req.body.password)

    const [user] = await db.insert(users).values({
      ...req.body,
      password: hashedPassword,
    }).returning({
      id: users.id,
      email: users.email,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
    })
    
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    
    return res.status(201).json({
      message: 'Welcome to SafeSite! Your account is active.',
      user,
      token
    })

    
  } catch(e: any) {
    console.error('Register error', e)
    // Handle duplicate email/username
    if (e.code === '23505' || e.cause?.code === '23505') {
      return res.status(409).json({ error: 'User with this email or username already exists' })
    }
    res.status(500).json({error: 'Failed to create user account'})
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const {username, password} = req.body
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    })

    if (!user) {
      return res.status(401).json({error: 'Authentication failed. Please verify your credentials.'})
    }

    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Authentication failed. Please verify your credentials.' })
    }

    
    const token = await generateToken ({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return res
      .json({
        message: "Access granted. Stay safe out there.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
        },
        token
      })
      .status(200)

  } catch (e) {
    console.error('Login error', e)
    res.status(500).json({error: 'Failed to authenticate'})
  }
}
