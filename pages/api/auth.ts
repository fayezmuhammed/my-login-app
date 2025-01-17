import type { NextApiRequest, NextApiResponse } from 'next'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    // TODO: Replace with actual database query
    if (username === 'demo' && password === 'demo') {
      const token = sign(
        { 
          id: '1046',
          username 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      res.setHeader('Set-Cookie', cookie.serialize('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/'
      }))

      return res.status(200).json({
        success: true,
        message: 'Authentication successful'
      })
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}