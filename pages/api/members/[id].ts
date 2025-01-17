import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Mock member data - replace with database
const mockMember = {
  id: "1046",
  name: "John Doe",
  email: "johndoe@gmail.com",
  phone: "56821552",
  country: "UAE",
  expirationDate: "12/31/2023",
  personalDetails: {
    father: "Doe",
    address: "V Villa",
    bloodGroup: "O+"
  },
  payments: [
    { year: 2017, amount: 1000 },
    { year: 2018, amount: 500 }
  ]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies['auth-token']
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  try {
    verify(token, JWT_SECRET)
    const { id } = req.query

    if (req.method === 'GET') {
      if (id === mockMember.id) {
        return res.status(200).json({
          success: true,
          data: mockMember
        })
      }
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      })
    }

    if (req.method === 'PATCH') {
      const updates = req.body
      if (id === mockMember.id) {
        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          data: { ...mockMember, ...updates }
        })
      }
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Operation failed'
    })
  }
}